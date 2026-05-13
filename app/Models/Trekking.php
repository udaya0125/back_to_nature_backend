<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Trekking extends Model
{
    //
     protected $fillable = [
        'title','category_id','sub_category_id','price','description','includes','excludes','slug'
    ];

     /**
     * Generate unique slug after creation
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($trekking) {
            $slug = Str::slug($trekking->title) . '-' . $trekking->id;

            $trekking->slug = $slug;
            $trekking->saveQuietly();
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function images()
    {
        return $this->hasMany(TrekkingImage::class);
    }
    public function itineraries()
    {
        return $this->hasMany(TrekkingItinerary::class);
    }

}
