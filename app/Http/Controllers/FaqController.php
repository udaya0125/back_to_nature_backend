<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FaqController extends Controller
{
    /**
     * Display all FAQs
     */
    public function index()
    {
        $faqs = Faq::with([
            'category',
            'tour',
            'trekking',
            'activity'
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Store new FAQ
     */
    public function store(Request $request)
    {
        $validated = $this->validateAndNormalizeFaq($request);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully',
            'data' => $faq
        ], 201);
    }

    /**
     * Update FAQ
     */
    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $validated = $this->validateAndNormalizeFaq($request);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully',
            'data' => $faq
        ]);
    }

    /**
     * Delete FAQ
     */
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);

        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully'
        ]);
    }

    private function validateAndNormalizeFaq(Request $request): array
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'tour_id' => 'nullable|exists:tours,id',
            'trekking_id' => 'nullable|exists:trekkings,id',
            'activity_id' => 'nullable|exists:activities,id',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ]);

        $associationKeys = ['tour_id', 'trekking_id', 'activity_id'];
        $filledAssociations = collect($associationKeys)
            ->filter(fn ($key) => !empty($validated[$key]))
            ->values();

        if ($filledAssociations->count() > 1) {
            throw ValidationException::withMessages([
                'association' => 'Only one of tour, trekking, or activity can be selected for an FAQ.',
            ]);
        }

        foreach ($associationKeys as $key) {
            $validated[$key] = $filledAssociations->contains($key)
                ? $validated[$key]
                : null;
        }

        return $validated;
    }
}
