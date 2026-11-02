<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->slug, 'databaseId' => $this->id, 'slug' => $this->slug, 'type' => $this->type, 'title' => $this->title,
            'category' => $this->category->name, 'category_id' => $this->category_id, 'creatorId' => $this->creator->slug, 'creator_id' => $this->creator_id,
            'creator' => new CreatorResource($this->creator), 'price' => $this->price, 'priceFrom' => $this->price_from, 'stock' => $this->stock,
            'commissionSlots' => $this->commission_slots, 'deliveryTime' => $this->delivery_time, 'rating' => $this->rating, 'description' => $this->description,
            'tags' => $this->tags ?? [], 'image' => $this->images->first()?->url(), 'images' => $this->images->map->url()->values(),
            'gallery' => ListingImageResource::collection($this->images)];
    }
}
