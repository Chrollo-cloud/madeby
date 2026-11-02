<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ListingImage extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['uploaded' => 'boolean'];
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function url(): string
    {
        return $this->uploaded ? Storage::disk('public')->url($this->path) : $this->path;
    }
}
