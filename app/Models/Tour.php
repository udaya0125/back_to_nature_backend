<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tour extends Model
{
    //
    protected $fillable = [
        'title', 'category_id', 'description', 'includes', 'excludes', 'slug',
    ];

    /**
     * Boot function to generate unique slug
     */
    // protected static function boot()
    // {
    //     parent::boot();

    //     static::created(function ($tour) {
    //         $baseSlug = Str::slug($tour->title);

    //         // Add ID after creation to make it unique
    //         $tour->slug = $baseSlug . '-' . $tour->id;

    //         $tour->saveQuietly();
    //     });
    // }

    protected static function boot()
    {
        parent::boot();

        // On CREATE: generate slug with random 5-digit number
        static::creating(function ($tour) {
            $tour->slug = Str::slug($tour->title).'-'.rand(10000, 99999);
        });

        // On UPDATE: if title changed, rebuild slug keeping the same 5-digit number
        static::updating(function ($tour) {
            if ($tour->isDirty('title')) {
                // Extract the existing 5-digit number from the old slug
                preg_match('/-(\d{5})$/', $tour->getOriginal('slug'), $matches);
                $number = $matches[1] ?? rand(10000, 99999); // fallback if not found

                $tour->slug = Str::slug($tour->title).'-'.$number;
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(TourImage::class);
    }

    public function itineraries()
    {
        return $this->hasMany(TourItinerary::class);
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }
}
