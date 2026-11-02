<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Creator;
use App\Models\Listing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(__DIR__.'/catalogue.json'), true, 512, JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($data) {
            foreach ($data['categories'] as $name) {
                if ($name !== 'ALL') {
                    Category::firstOrCreate(['name' => $name], ['slug' => Str::slug($name)]);
                }
            }
            foreach ($data['creators'] as $c) {
                $slug = $c['id'];
                unset($c['id'],$c['works']);
                Creator::firstOrCreate(['slug' => $slug], $c);
            }
            foreach ($data['products'] as $p) {
                $listing = Listing::firstOrCreate(['slug' => $p['id']], [
                    'title' => $p['title'], 'type' => $p['type'], 'description' => $p['description'], 'creator_id' => Creator::where('slug', $p['creatorId'])->firstOrFail()->id,
                    'category_id' => Category::where('name', $p['category'])->firstOrFail()->id, 'price' => $p['price'] ?? null, 'price_from' => $p['priceFrom'] ?? null,
                    'stock' => $p['stock'] ?? null, 'commission_slots' => $p['commissionSlots'] ?? null, 'delivery_time' => $p['deliveryTime'] ?? null, 'rating' => $p['rating'], 'tags' => $p['tags']]);
                if ($listing->wasRecentlyCreated) {
                    foreach ($p['images'] as $i => $path) {
                        $listing->images()->create(['path' => $path, 'position' => $i]);
                    }
                }
            }
        });
    }
}
