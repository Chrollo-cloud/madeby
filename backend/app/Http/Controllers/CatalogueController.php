<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\CreatorResource;
use App\Models\Category;
use App\Models\Creator;

class CatalogueController extends Controller
{
    public function categories()
    {
        return CategoryResource::collection(Category::orderBy('id')->get());
    }

    public function creators()
    {
        return CreatorResource::collection(Creator::withCount('listings')->orderBy('id')->get());
    }

    public function creator(string $creator)
    {
        return new CreatorResource(Creator::withCount('listings')->where('slug', $creator)->when(ctype_digit($creator), fn ($q) => $q->orWhere('id', $creator))->firstOrFail());
    }
}
