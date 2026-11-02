<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['tags' => 'array', 'price' => 'float', 'price_from' => 'float', 'rating' => 'float'];
    }

    public function creator()
    {
        return $this->belongsTo(Creator::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ListingImage::class)->orderBy('position')->orderBy('id');
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('slug', $value)->when(ctype_digit((string) $value), fn ($q) => $q->orWhere('id', $value))->firstOrFail();
    }
}
