<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tour extends Model
{
    //
    protected $fillable = [
        'title','category_id','description','includes','excludes','slug'
    ];

     /**
     * Boot function to generate unique slug
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($tour) {
            $baseSlug = Str::slug($tour->title);

            // Add ID after creation to make it unique
            $tour->slug = $baseSlug . '-' . $tour->id;

            $tour->saveQuietly();
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
}
