<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\ActivityImage;
use App\Models\ActivityItinerary;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActivitiesController extends Controller
{
    /**
     * INDEX - Get all activities with relations
     */
    public function index()
    {
        $activities = Activities::with(['images', 'itineraries'])->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $activities,
        ]);
    }

    /**
     * INDEX - Get all activities (title, description, and first image only)
     */
    public function indexShow()
    {
        $activities = Activities::with(['images' => function ($query) {
            $query->oldest()->limit(1);
        }])
            ->select('id', 'title', 'description', 'slug')
            ->latest()
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'slug' => $activity->slug,
                    'image' => $activity->images->first()?->image ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Display all activities for navbar (title, slug, category, sub_category only)
     */
    public function indexNavbar()
    {
        $activities = Activities::with(['category', 'subCategory'])
            ->select('id', 'title', 'slug', 'category_id', 'sub_category_id')
            ->latest()
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->title,
                    'slug' => $activity->slug,
                    'category' => $activity->category,
                    'sub_category' => $activity->subCategory,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Display single activity by slug with all relations
     */
    public function indexShowActivitySlug($slug)
    {
        $activity = Activities::with(['images', 'itineraries'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $activity,
        ]);
    }

    /**
     * STORE - Create activity with images + itineraries
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'sub_category_id' => 'required|integer|exists:sub_categories,id',
            'description' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // arrays
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',  // 5MB max
            'itineraries' => 'array',
            'itineraries.*.day' => 'required|integer',
            'itineraries.*.title' => 'required|string|max:255',
            'itineraries.*.description' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            // 1. Create Activity
            $activity = Activities::create([
                'title' => $request->title,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description' => $request->description,
                'includes' => $request->includes,
                'excludes' => $request->excludes,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
            ]);

            // 2. Save Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('activities', 'public');

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'image' => $path,
                    ]);
                }
            }

            // 3. Save Itineraries
            if ($request->has('itineraries') && !empty($request->itineraries)) {
                foreach ($request->itineraries as $itinerary) {
                    ActivityItinerary::create([
                        'activity_id' => $activity->id,
                        'day' => $itinerary['day'],
                        'title' => $itinerary['title'],
                        'description' => $itinerary['description'],
                    ]);
                }
            }

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => $request->ip(),
                'title' => 'Created activity: ' . $activity->title,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity created successfully',
                'data' => $activity->load(['images', 'itineraries']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to create activity: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * UPDATE - Update activity + relations with proper image deletion
     */
    public function update(Request $request, $id)
    {
        $activity = Activities::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'sub_category_id' => 'required|integer|exists:sub_categories,id',
            'description' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',
            
            // Handle deleted images from frontend
            'deleted_images' => 'array',
            'deleted_images.*' => 'integer|exists:activity_images,id',
            
            // New images
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            
            // Itineraries
            'itineraries' => 'array',
            'itineraries.*.day' => 'required|integer',
            'itineraries.*.title' => 'required|string|max:255',
            'itineraries.*.description' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $oldTitle = $activity->title;

            // 1. Update main activity
            $activity->update([
                'title' => $request->title,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description' => $request->description,
                'includes' => $request->includes,
                'excludes' => $request->excludes,
                'slug' => Str::slug($request->title) . '-' . $activity->id,
            ]);

            // 2. Handle deleted images (remove from storage and database)
            if ($request->has('deleted_images') && !empty($request->deleted_images)) {
                $imagesToDelete = ActivityImage::whereIn('id', $request->deleted_images)
                    ->where('activity_id', $activity->id)
                    ->get();
                
                foreach ($imagesToDelete as $image) {
                    // Delete physical file from storage
                    if ($image->image && Storage::disk('public')->exists($image->image)) {
                        Storage::disk('public')->delete($image->image);
                    }
                    // Delete database record
                    $image->delete();
                }
            }

            // 3. Add new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('activities', 'public');
                    
                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'image' => $path,
                    ]);
                }
            }

            // 4. Handle itineraries (complete replacement)
            if ($request->has('itineraries')) {
                // Delete existing itineraries
                $activity->itineraries()->delete();
                
                // Create new itineraries
                foreach ($request->itineraries as $itinerary) {
                    ActivityItinerary::create([
                        'activity_id' => $activity->id,
                        'day' => $itinerary['day'],
                        'title' => $itinerary['title'],
                        'description' => $itinerary['description'],
                    ]);
                }
            }

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => $request->ip(),
                'title' => 'Updated activity: "' . $oldTitle . '" -> "' . $activity->title . '"',
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity updated successfully',
                'data' => $activity->load(['images', 'itineraries']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to update activity: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE - Delete activity + relations with physical file cleanup
     */
    public function destroy($id)
    {
        $activity = Activities::findOrFail($id);

        DB::beginTransaction();

        try {
            $activityTitle = $activity->title;

            // Delete physical image files from storage
            foreach ($activity->images as $image) {
                if ($image->image && Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }
            
            // Delete related records first
            $activity->images()->delete();
            $activity->itineraries()->delete();

            // Delete activity
            $activity->delete();

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => request()->ip(),
                'title' => 'Deleted activity: ' . $activityTitle,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete activity: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get deleted images (optional - for undo functionality)
     */
    public function getDeletedImages()
    {
        // This is optional - you might want to implement soft deletes for images
        // For now, just return empty response
        return response()->json([
            'status' => true,
            'data' => [],
        ]);
    }

    /**
     * Restore deleted image (optional - if using soft deletes)
     */
    public function restoreImage($id)
    {
        // Implement if you want soft delete functionality
        // For now, return not implemented
        return response()->json([
            'status' => false,
            'message' => 'Feature not implemented',
        ], 501);
    }
}