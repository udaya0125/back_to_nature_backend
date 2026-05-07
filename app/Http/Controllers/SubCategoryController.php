<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * Display all subcategories
     */
    public function index()
    {
        $subCategories = SubCategory::with('category')
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $subCategories
        ]);
    }

    /**
     * Store new subcategory
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ]);

        $subCategory = SubCategory::create([
            'name'        => $request->name,
            'category_id' => $request->category_id
        ]);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => 'Created sub-category: "' . $subCategory->name
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'SubCategory created successfully',
            'data'    => $subCategory
        ]);
    }

    /**
     * Update subcategory
     */
    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ]);

        $oldName       = $subCategory->name;
        $oldCategoryId = $subCategory->category_id;

        $subCategory->update([
            'name'        => $request->name,
            'category_id' => $request->category_id
        ]);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => 'Updated sub-category: "' . $oldName . '" → "' . $subCategory->name 
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'SubCategory updated successfully',
            'data'    => $subCategory
        ]);
    }

    /**
     * Delete subcategory
     */
    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategoryName = $subCategory->name;
        $categoryId      = $subCategory->category_id;

        $subCategory->delete();

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => 'Deleted sub-category: "' . $subCategoryName
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'SubCategory deleted successfully'
        ]);
    }
}