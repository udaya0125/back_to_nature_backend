<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\ActivityImage;
use App\Models\ActivityItinerary;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'data' => $activities
        ]);
    }

    /**
     * STORE - Create activity with images + itineraries
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'category_id' => 'required|integer',
            'sub_category_id' => 'required|integer',
            'description' => 'nullable|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // arrays
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'itineraries' => 'array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required',
            'itineraries.*.description' => 'required',
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
                'slug' => Str::slug($request->title),
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
            if ($request->itineraries) {
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
                'data' => $activity->load(['images', 'itineraries'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * UPDATE - Update activity + relations
     */
    public function update(Request $request, $id)
    {
        $activity = Activities::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'category_id' => 'required|integer',
            'sub_category_id' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $oldTitle = $activity->title;

            // Update main activity
            $activity->update([
                'title' => $request->title,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description' => $request->description,
                'includes' => $request->includes,
                'excludes' => $request->excludes,
                'slug' => Str::slug($request->title) . '-' . $activity->id,
            ]);

            // OPTIONAL: replace images
            if ($request->hasFile('images')) {

                // delete old images
                $activity->images()->delete();

                foreach ($request->file('images') as $image) {
                    $path = $image->store('activities', 'public');

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'image' => $path,
                    ]);
                }
            }

            // OPTIONAL: replace itineraries
            if ($request->itineraries) {
                $activity->itineraries()->delete();

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
                'data' => $activity->load(['images', 'itineraries'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE - Delete activity + relations
     */
    public function destroy($id)
    {
        $activity = Activities::findOrFail($id);

        DB::beginTransaction();

        try {
            $activityTitle = $activity->title;

            // delete related records first
            $activity->images()->delete();
            $activity->itineraries()->delete();

            // delete activity
            $activity->delete();

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => request()->ip(),
                'title' => 'Deleted activity: ' . $activityTitle,
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
