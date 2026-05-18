<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    //
    protected $fillable = [
        'category_id',
        'tour_id',
        'trekking_id',
        'activity_id',
        'question',
        'answer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
    public function trekking()
    {
        return $this->belongsTo(Trekking::class);       
    }
    public function activity()
    {
        return $this->belongsTo(Activities::class);
    }   
}
