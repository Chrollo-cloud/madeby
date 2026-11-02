<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListingRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        if ($this->exists('tags') && $this->input('tags') === null) {
            $this->merge(['tags' => []]);
        }
    }

    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        $listing = $this->route('listing');
        $partial = $listing ? 'sometimes' : 'required';
        $type = $this->input('type', $listing?->type);
        $switch = $listing && $listing->type !== $type;

        return [
            'slug' => [$listing ? 'sometimes' : 'required', 'string', 'max:180', 'regex:/^[a-z][a-z0-9-]*$/', Rule::unique('listings')->ignore($listing)],
            'title' => [$partial, 'string', 'max:255'], 'type' => [$partial, Rule::in(['product', 'commission'])],
            'creator_id' => [$partial, 'integer', 'exists:creators,id'], 'category_id' => [$partial, 'integer', 'exists:categories,id'],
            'description' => [$partial, 'string', 'max:20000'],
            'price' => [$type === 'product' && (! $listing || $switch) ? 'required' : 'nullable', 'numeric', 'min:0', 'max:9999999999'],
            'stock' => [$type === 'product' && (! $listing || $switch) ? 'required' : 'nullable', 'integer', 'min:0', 'max:1000000'],
            'price_from' => [$type === 'commission' && (! $listing || $switch) ? 'required' : 'nullable', 'numeric', 'min:0', 'max:9999999999'],
            'commission_slots' => [$type === 'commission' && (! $listing || $switch) ? 'required' : 'nullable', 'integer', 'min:0', 'max:1000000'],
            'delivery_time' => ['nullable', 'string', 'max:255'], 'rating' => ['sometimes', 'numeric', 'between:0,5'],
            'tags' => ['sometimes', 'array', 'max:30'], 'tags.*' => ['string', 'max:100'],
            'images' => [$listing ? 'sometimes' : 'required', 'array', 'min:1', 'max:10'], 'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_image_ids' => ['sometimes', 'array'], 'remove_image_ids.*' => ['integer', Rule::exists('listing_images', 'id')->where('listing_id', $listing?->id)],
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }
            $listing = $this->route('listing');
            $type = $this->input('type', $listing?->type);
            $remaining = ($listing?->images()->count() ?? 0) - count(array_unique($this->input('remove_image_ids', []))) + count($this->file('images', []));
            if ($remaining < 1) {
                $validator->errors()->add('images', 'Keep at least one listing image.');
            }
            if ($remaining > 10) {
                $validator->errors()->add('images', 'A listing can have at most 10 images.');
            }
            foreach (($type === 'product' ? ['price', 'stock'] : ['price_from', 'commission_slots']) as $field) {
                if ($this->exists($field) && $this->input($field) === null) {
                    $validator->errors()->add($field, 'This field cannot be empty for this listing type.');
                }
            }
        }];
    }
}
