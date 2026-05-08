<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\ActivityImage;
use App\Models\ActivityItinerary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activities::with(['images', 'itineraries'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'                       => 'required|string|max:255',
            'category_id'                 => 'required',
            'sub_category_id'             => 'required',
            'description'                 => 'required',
            'includes'                    => 'nullable',
            'excludes'                    => 'nullable',
            'images.*'                    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'itineraries'                 => 'nullable|array',
            'itineraries.*.day'           => 'required',
            'itineraries.*.title'         => 'required',
            'itineraries.*.description'   => 'required',
        ]);

        DB::beginTransaction();

        try {
            $activity = Activities::create([
                'title'           => $request->title,
                'category_id'     => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description'     => $request->description,
                'includes'        => $request->includes,
                'excludes'        => $request->excludes,
            ]);

            // Upload images
            if ($request->hasFile('images')) {
                $uploadPath = public_path('uploads/activities');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move($uploadPath, $imageName);

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'image'       => 'uploads/activities/' . $imageName,
                    ]);
                }
            }

            // Store itineraries
            if ($request->filled('itineraries')) {
                foreach ($request->itineraries as $itinerary) {
                    ActivityItinerary::create([
                        'activity_id' => $activity->id,
                        'day'         => $itinerary['day'],
                        'title'       => $itinerary['title'],
                        'description' => $itinerary['description'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Activity created successfully',
                'data'    => $activity->load(['images', 'itineraries']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $activity = Activities::findOrFail($id);

        $request->validate([
            'title'                       => 'required|string|max:255',
            'category_id'                 => 'required',
            'sub_category_id'             => 'required',
            'description'                 => 'required',
            'includes'                    => 'nullable',
            'excludes'                    => 'nullable',
            'images.*'                    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'itineraries'                 => 'nullable|array',
            'itineraries.*.day'           => 'required',
            'itineraries.*.title'         => 'required',
            'itineraries.*.description'   => 'required',
        ]);

        DB::beginTransaction();

        try {
            $activity->update([
                'title'           => $request->title,
                'category_id'     => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description'     => $request->description,
                'includes'        => $request->includes,
                'excludes'        => $request->excludes,
            ]);

            // Upload new images
            if ($request->hasFile('images')) {
                $uploadPath = public_path('uploads/activities');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move($uploadPath, $imageName);

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'image'       => 'uploads/activities/' . $imageName,
                    ]);
                }
            }

            // Replace itineraries
            if ($request->has('itineraries')) {
                ActivityItinerary::where('activity_id', $activity->id)->delete();

                foreach ($request->itineraries as $itinerary) {
                    ActivityItinerary::create([
                        'activity_id' => $activity->id,
                        'day'         => $itinerary['day'],
                        'title'       => $itinerary['title'],
                        'description' => $itinerary['description'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Activity updated successfully',
                'data'    => $activity->load(['images', 'itineraries']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $activity = Activities::with(['images', 'itineraries'])->findOrFail($id);

        DB::beginTransaction();

        try {
            foreach ($activity->images as $image) {
                $imagePath = public_path($image->image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
                $image->delete();
            }

            ActivityItinerary::where('activity_id', $activity->id)->delete();
            $activity->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Activity deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}