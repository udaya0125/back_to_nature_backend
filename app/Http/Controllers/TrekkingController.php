<?php

namespace App\Http\Controllers;

use App\Models\Trekking;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TrekkingController extends Controller
{
    /**
     * Display all trekking records
     */
    public function index()
    {
        $trekkings = Trekking::with([
            'category',
            'images',
            'itineraries'
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $trekkings
        ]);
    }

    /**
     * Store new trekking
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'price' => 'nullable|numeric',
            'description' => 'required|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            // images
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            // itineraries
            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string',
            'itineraries.*.description' => 'required|string',
        ]);

        // Create trekking
        $trekking = Trekking::create([
            'title' => $request->title,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'price' => $request->price,
            'description' => $request->description,
            'includes' => $request->includes,
            'excludes' => $request->excludes,
        ]);

        /**
         * Upload Images
         */
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store('trekkings', 'public');

                $trekking->images()->create([
                    'image' => $path
                ]);
            }
        }

        /**
         * Store Itineraries
         */
        if ($request->has('itineraries')) {

            foreach ($request->itineraries as $item) {

                $trekking->itineraries()->create([
                    'day' => $item['day'],
                    'title' => $item['title'],
                    'description' => $item['description'],
                ]);
            }
        }

        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => 'Created trekking: ' . $trekking->title,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trekking created successfully',
            'data' => $trekking->load('images', 'itineraries')
        ], 201);
    }

    /**
     * Update trekking
     */
    public function update(Request $request, $id)
    {
        $trekking = Trekking::findOrFail($id);
        $oldTitle = $trekking->title;

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'price' => 'nullable|numeric',
            'description' => 'required|string',
            'includes' => 'nullable|string',
            'excludes' => 'nullable|string',

            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string',
            'itineraries.*.description' => 'required|string',
        ]);

        // Update trekking
        $trekking->update([
            'title' => $request->title,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'price' => $request->price,
            'description' => $request->description,
            'includes' => $request->includes,
            'excludes' => $request->excludes,
        ]);

        /**
         * Upload new images
         */
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store('trekkings', 'public');

                $trekking->images()->create([
                    'image' => $path
                ]);
            }
        }

        /**
         * Replace itineraries
         */
        if ($request->has('itineraries')) {

            // delete old itineraries
            $trekking->itineraries()->delete();

            // add new itineraries
            foreach ($request->itineraries as $item) {

                $trekking->itineraries()->create([
                    'day' => $item['day'],
                    'title' => $item['title'],
                    'description' => $item['description'],
                ]);
            }
        }

        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => 'Updated trekking: "' . $oldTitle . '" -> "' . $trekking->title . '"',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trekking updated successfully',
            'data' => $trekking->load('images', 'itineraries')
        ]);
    }

    /**
     * Delete trekking
     */
    public function destroy($id)
    {
        $trekking = Trekking::with(['images', 'itineraries'])->findOrFail($id);
        $trekkingTitle = $trekking->title;

        /**
         * Delete Images from storage
         */
        foreach ($trekking->images as $image) {

            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }
        }

        // Delete relations
        $trekking->images()->delete();
        $trekking->itineraries()->delete();

        // Delete trekking
        $trekking->delete();

        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title' => 'Deleted trekking: ' . $trekkingTitle,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trekking deleted successfully'
        ]);
    }
}
