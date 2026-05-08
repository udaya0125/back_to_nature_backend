<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityItinerary extends Model
{
    //
    protected $fillable = [
        'activity_id',
        'day',
        'title',
        'description'
    ];

     public function activity(): BelongsTo
    {
        return $this->belongsTo(Activities::class);
    }
}
