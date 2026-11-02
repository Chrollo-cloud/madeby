<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Creator extends Model
{
    protected $guarded = [];

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
