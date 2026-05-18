<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Tour;
use App\Models\TourImage;
use App\Models\TourItinerary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TourController extends Controller
{
    /**
     * Display all tours
     */
    public function index()
    {
        $tours = Tour::with(['category', 'images', 'itineraries'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tours,
        ], 200);
    }

    /**
     * Display all tours (title, description, and first image only)
     */
    public function indexShow()
    {
        $tours = Tour::with(['images' => function ($query) {
            $query->oldest()->limit(1);
        }])
            ->select('id', 'title', 'description', 'slug')
            ->latest()
            ->get()
            ->map(function ($tour) {
                return [
                    'id' => $tour->id,
                    'title' => $tour->title,
                    'description' => $tour->description,
                    'slug' => $tour->slug,
                    'image' => $tour->images->first()?->image ?? null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $tours,
        ], 200);
    }

    // public function indexShowTourSlug($slug)
    // {
    //     $tours = Tour::where('slug', $slug)->firstOrFail();

    //     return response()->json([
    //         'success' => true,
    //         'data' => $tours,
    //     ]);
    // }

    public function indexShowTourSlug($slug)
    {
        $tours = Tour::with(['category', 'images', 'itineraries'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    /**
 * Display all tours for navbar (title, slug, category only)
 */
public function indexNavbar()
{
    $tours = Tour::with(['category'])
        ->select('id', 'title', 'slug', 'category_id')
        ->latest()
        ->get()
        ->map(function ($tour) {
            return [
                'id'       => $tour->id,
                'title'    => $tour->title,
                'slug'     => $tour->slug,
                'category' => $tour->category,
            ];
        });

    return response()->json([
        'success' => true,
        'data'    => $tours,
    ]);
}

    /**
     * Store a new tour
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // Images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            // Itineraries
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string|max:255',
            'itineraries.*.description' => 'required|string',
        ]);

        DB::beginTransaction();

        try {

            // Create Tour
            $tour = Tour::create([
                'title' => $request->title,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'includes' => $request->includes,
                'excludes' => $request->excludes,
                'slug' => Str::slug($request->title),
            ]);

            /**
             * Upload Images
             */
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('tours', 'public');

                    TourImage::create([
                        'tour_id' => $tour->id,
                        'image' => $path,
                    ]);
                }
            }

            /**
             * Store Itineraries
             */
            if ($request->has('itineraries')) {

                foreach ($request->itineraries as $item) {

                    TourItinerary::create([
                        'tour_id' => $tour->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'],
                    ]);
                }
            }

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => $request->ip(),
                'title' => 'Created tour: '.$tour->title,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tour created successfully',
                'data' => $tour->load(['images', 'itineraries']),
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Tour
     */
    public function update(Request $request, $id)
    {
        $tour = Tour::with(['images', 'itineraries'])->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // New Images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            // Itineraries
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string|max:255',
            'itineraries.*.description' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $oldTitle = $tour->title;

            // Update Tour
            $tour->update([
                'title' => $request->title,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'includes' => $request->includes,
                'excludes' => $request->excludes,
            ]);

            /**
             * Add New Images
             */
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('tours', 'public');

                    TourImage::create([
                        'tour_id' => $tour->id,
                        'image' => $path,
                    ]);
                }
            }

            /**
             * Replace Itineraries
             */
            if ($request->has('itineraries')) {

                // Delete old itineraries
                $tour->itineraries()->delete();

                // Add new itineraries
                foreach ($request->itineraries as $item) {

                    TourItinerary::create([
                        'tour_id' => $tour->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'],
                    ]);
                }
            }

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => $request->ip(),
                'title' => 'Updated tour: "'.$oldTitle.'" -> "'.$tour->title.'"',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tour updated successfully',
                'data' => $tour->load(['images', 'itineraries']),
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Tour
     */
    public function destroy($id)
    {
        $tour = Tour::with(['images', 'itineraries'])->findOrFail($id);

        DB::beginTransaction();

        try {
            $tourTitle = $tour->title;

            /**
             * Delete Images From Storage
             */
            foreach ($tour->images as $image) {

                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }

            /**
             * Delete Related Data
             */
            $tour->images()->delete();
            $tour->itineraries()->delete();

            /**
             * Delete Tour
             */
            $tour->delete();

            ActivityLog::create([
                'name' => auth()->user()->name ?? 'System',
                'ip_address' => request()->ip(),
                'title' => 'Deleted tour: '.$tourTitle,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tour deleted successfully',
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
