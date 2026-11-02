<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListingImageResource extends JsonResource
{
    public function toArray($request): array
    {
        return ['id' => $this->id, 'url' => $this->resource->url(), 'position' => $this->position];
    }
}
