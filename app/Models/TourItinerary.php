<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourItinerary extends Model
{
    //
    protected $fillable = [
        'tour_id',
        'day',
        'title',
        'description'
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
