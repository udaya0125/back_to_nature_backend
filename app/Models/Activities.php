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

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Step 1: before insert, create base slug
        static::creating(function ($activity) {
            $activity->slug = Str::slug($activity->title);
        });

        // Step 2: after insert, append ID to make it unique
        static::created(function ($activity) {
            $activity->slug = $activity->slug.'-'.$activity->id;
            $activity->saveQuietly(); // avoid triggering events again
        });
    }
}
