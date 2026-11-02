<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate(['search' => 'nullable|string|max:200', 'category' => 'nullable|string|max:100', 'type' => 'nullable|in:product,commission', 'page' => 'sometimes|integer|min:1', 'per_page' => 'sometimes|integer|between:1,100']);
        $q = Listing::with(['creator', 'category', 'images']);
        $type = $request->route('type') ?? ($filters['type'] ?? null);
        if ($type) {
            $q->where('type', $type);
        }
        if (! empty($filters['category'])) {
            $q->whereHas('category', fn ($q) => $q->where('name', $filters['category'])->orWhere('slug', $filters['category']));
        }
        if (! empty($filters['search'])) {
            $term = '%'.$filters['search'].'%';
            $q->where(fn ($q) => $q->where('title', 'like', $term)->orWhere('description', 'like', $term)->orWhere('tags', 'like', $term)->orWhereHas('creator', fn ($q) => $q->where('name', 'like', $term)));
        }

        return ListingResource::collection($q->orderBy('id')->paginate($filters['per_page'] ?? 12)->withQueryString());
    }

    public function show(Listing $listing)
    {
        return new ListingResource($listing->load(['creator', 'category', 'images']));
    }

    public function store(ListingRequest $request)
    {
        Gate::authorize('create', Listing::class);
        $listing = $this->save($request, new Listing);

        return (new ListingResource($listing))->response()->setStatusCode(201);
    }

    public function update(ListingRequest $request, Listing $listing)
    {
        Gate::authorize('update', $listing);

        return new ListingResource($this->save($request, $listing));
    }

    private function save(ListingRequest $request, Listing $listing): Listing
    {
        $data = $request->safe()->except(['images', 'remove_image_ids']);
        $type = $data['type'] ?? $listing->type;
        if ($type === 'product') {
            $data['price_from'] = null;
            $data['commission_slots'] = null;
        } else {
            $data['price'] = null;
            $data['stock'] = null;
        }
        $stored = [];
        $oldPaths = [];
        try {
            DB::transaction(function () use ($request, $listing, $data, &$stored, &$oldPaths) {
                $listing->fill($data)->save();
                foreach ($listing->images()->whereIn('id', $request->input('remove_image_ids', []))->get() as $image) {
                    if ($image->uploaded) {
                        $oldPaths[] = $image->path;
                    } $image->delete();
                }
                $position = ($listing->images()->max('position') ?? -1) + 1;
                foreach ($request->file('images', []) as $file) {
                    $path = $file->store('listings', 'public');
                    $stored[] = $path;
                    $listing->images()->create(['path' => $path, 'uploaded' => true, 'position' => $position++]);
                }
            });
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($stored);
            throw $e;
        }
        Storage::disk('public')->delete($oldPaths);

        return $listing->load(['creator', 'category', 'images']);
    }

    public function destroy(Listing $listing)
    {
        Gate::authorize('delete', $listing);
        $paths = $listing->images()->where('uploaded', true)->pluck('path')->all();
        DB::transaction(fn () => $listing->delete());
        Storage::disk('public')->delete($paths);

        return response()->noContent();
    }
}
