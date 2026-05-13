<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Trekking extends Model
{
    protected $fillable = [
        'title', 'category_id', 'sub_category_id', 'price',
        'description', 'includes', 'excludes', 'slug',
    ];

    /**
     * Generate slug BEFORE insert so the NOT NULL constraint is satisfied.
     * We don't have the ID yet, so we use a unique suffix instead.
     * After creation, the `created` hook re-saves with the real ID appended.
     */
    protected static function boot()
    {
        parent::boot();

        // Before insert — give a temporary unique slug so the row can be saved
        static::creating(function ($trekking) {
            $trekking->slug = Str::slug($trekking->title).'-'.uniqid();
        });

        // After insert — replace with the clean slug that includes the real ID
        static::created(function ($trekking) {
            $trekking->slug = Str::slug($trekking->title).'-'.$trekking->id;
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
