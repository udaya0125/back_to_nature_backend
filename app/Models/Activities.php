<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;  // <-- THIS WAS MISSING - causes the 500 error

class Activities extends Model
{
    //
    protected $fillable = [
        'title', 'category_id', 'sub_category_id', 'description', 'includes', 'excludes', 'slug',
    ];

    // public function images()
    // {
    //     return $this->hasMany(ActivityImage::class);
    // }

    // public function itineraries()
    // {
    //     return $this->hasMany(ActivityItinerary::class);
    // }

    // In Activities model
    public function images()
    {
        return $this->hasMany(ActivityImage::class, 'activity_id'); // 👈 explicit FK
    }

    public function itineraries()
    {
        return $this->hasMany(ActivityItinerary::class, 'activity_id'); // 👈 explicit FK
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id'); // 👈 explicit FK
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id'); // 👈 explicit FK
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }

    // protected static function boot()
    // {
    //     parent::boot();

    //     // Step 1: before insert, create base slug
    //     static::creating(function ($activity) {
    //         $activity->slug = Str::slug($activity->title);
    //     });

    //     // Step 2: after insert, append ID to make it unique
    //     static::created(function ($activity) {
    //         $activity->slug = $activity->slug.'-'.$activity->id;
    //         $activity->saveQuietly(); // avoid triggering events again
    //     });
    // }

    protected static function boot()
{
    parent::boot();

    // On CREATE: generate slug with random 5-digit number
    static::creating(function ($activity) {
        $activity->slug = Str::slug($activity->title) . '-' . rand(10000, 99999);
    });

    // On UPDATE: if title changed, rebuild slug keeping the same 5-digit number
    static::updating(function ($activity) {
        if ($activity->isDirty('title')) {
            // Extract the existing 5-digit number from the old slug
            preg_match('/-(\d{5})$/', $activity->getOriginal('slug'), $matches);
            $number = $matches[1] ?? rand(10000, 99999); // fallback if not found

            $activity->slug = Str::slug($activity->title) . '-' . $number;
        }
    });
}
}
