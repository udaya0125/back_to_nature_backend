<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ActivityImage extends Model
{
    //
    protected $fillable = [
        'activity_id',
        'image'
    ];

    // public function activity(): BelongsTo
    // {
    //     return $this->belongsTo(Activities::class);
    // }
    // In ActivityImage model
public function activity()
{
    return $this->belongsTo(Activities::class, 'activity_id'); // 👈 explicit FK
}
}
