<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
    'specifications' => 'array', // or AsArrayObject::class if you need dirty-tracking on nested writes
    ];

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable')->orderBy('order');
    }

    public function primaryImage(): MorphMany
    {
        return $this->images()->where('is_primary', true);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
