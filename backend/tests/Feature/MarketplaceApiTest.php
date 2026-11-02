<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Creator;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MarketplaceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function payload(array $extra = []): array
    {
        return array_merge(['slug' => 'test-work', 'title' => 'Test work', 'type' => 'product', 'creator_id' => Creator::first()->id, 'category_id' => Category::first()->id, 'description' => 'A test listing', 'price' => 50000, 'stock' => 3, 'tags' => ['test']], $extra);
    }

    private function admin(): void
    {
        $user = User::factory()->create();
        $user->is_admin = true;
        $user->save();
        Sanctum::actingAs($user);
    }

    public function test_original_catalogue(): void
    {
        $this->getJson('/api/listings?per_page=100')->assertOk()->assertJsonCount(10, 'data')->assertJsonPath('data.0.id', 'preorder-graphic-tee');
        $this->getJson('/api/categories')->assertOk()->assertJsonCount(7, 'data');
        $this->getJson('/api/creators')->assertOk()->assertJsonCount(6, 'data');
        $this->getJson('/api/creators/maylin')->assertOk()->assertJsonPath('data.works', 2);
        $this->getJson('/api/listings/studio-portrait-session')->assertOk()->assertJsonCount(5, 'data.images')->assertJsonPath('data.priceFrom', 300000);
        $this->getJson('/api/listings/'.Listing::first()->id)->assertOk();
        $this->getJson('/api/listings/missing')->assertNotFound();
    }

    public function test_filters_and_pagination(): void
    {
        $this->getJson('/api/listings?search=tee')->assertOk()->assertJsonPath('meta.total', 2);
        $this->getJson('/api/listings?category=PHOTOGRAPHY&type=commission')->assertOk()->assertJsonPath('meta.total', 2);
        $this->getJson('/api/products')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/commissions')->assertOk()->assertJsonCount(6, 'data');
        $this->getJson('/api/listings?per_page=3&page=2')->assertOk()->assertJsonCount(3, 'data')->assertJsonPath('meta.last_page', 4);
        $this->getJson('/api/listings?per_page=101')->assertUnprocessable();
    }

    public function test_authorization(): void
    {
        $this->postJson('/api/listings', $this->payload())->assertUnauthorized();
        $this->patchJson('/api/listings/sticker-pack', ['title' => 'Changed'])->assertUnauthorized();
        $this->deleteJson('/api/listings/sticker-pack')->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/listings', $this->payload())->assertForbidden();
        $this->patchJson('/api/listings/sticker-pack', ['title' => 'Changed'])->assertForbidden();
        $this->deleteJson('/api/listings/sticker-pack')->assertForbidden();
    }

    public function test_crud_and_image_cleanup(): void
    {
        Storage::fake('public');
        $this->admin();
        $this->postJson('/api/listings', $this->payload(['images' => [UploadedFile::fake()->image('work.jpg')]]))->assertCreated()->assertJsonPath('data.id', 'test-work');
        $listing = Listing::where('slug', 'test-work')->firstOrFail();
        $path = $listing->images->first()->path;
        Storage::disk('public')->assertExists($path);
        $this->patchJson('/api/listings/test-work', ['title' => 'Edited', 'price' => 60000])->assertOk()->assertJsonPath('data.price', 60000);
        $this->assertDatabaseHas('listings', ['slug' => 'test-work', 'title' => 'Edited', 'price' => 60000]);
        $this->deleteJson('/api/listings/'.$listing->id)->assertNoContent();
        $this->assertDatabaseMissing('listings', ['id' => $listing->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_validation_and_type_switch(): void
    {
        $this->admin();
        $this->postJson('/api/listings', [])->assertUnprocessable()->assertJsonValidationErrors(['title', 'slug', 'type', 'creator_id', 'category_id']);
        $this->postJson('/api/listings', $this->payload(['slug' => 'sticker-pack', 'price' => -1]))->assertUnprocessable()->assertJsonValidationErrors(['slug', 'price']);
        $this->patchJson('/api/listings/sticker-pack', ['type' => 'commission'])->assertUnprocessable()->assertJsonValidationErrors(['price_from', 'commission_slots']);
        $this->patchJson('/api/listings/sticker-pack', ['type' => 'commission', 'price_from' => 90000, 'commission_slots' => 2])->assertOk()->assertJsonPath('data.price', null)->assertJsonPath('data.stock', null);
        $this->patchJson('/api/listings/sticker-pack', ['price_from' => null])->assertUnprocessable();
        $this->patchJson('/api/listings/sticker-pack', ['remove_image_ids' => [99999]])->assertUnprocessable();
    }

    public function test_seeder_preserves_edits(): void
    {
        Listing::first()->update(['title' => 'Keep edits']);
        $this->seed();
        $this->assertDatabaseCount('listings', 10);
        $this->assertDatabaseHas('listings', ['title' => 'Keep edits']);
    }

    public function test_login_logout(): void
    {
        $user = User::factory()->create(['password' => bcrypt('test-password-123')]);
        $user->is_admin = true;
        $user->save();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'incorrect'])->assertUnprocessable();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'test-password-123'])->assertNoContent();
        $this->getJson('/api/user')->assertOk()->assertJsonPath('data.is_admin', true);
        $this->postJson('/logout')->assertNoContent();
        $this->assertGuest('web');
    }

    public function test_registration_cannot_grant_admin(): void
    {
        $this->postJson('/register', ['name' => 'Student', 'email' => 'student@example.test', 'password' => 'test-password-123', 'password_confirmation' => 'test-password-123', 'is_admin' => true])->assertNoContent();
        $this->assertDatabaseHas('users', ['email' => 'student@example.test', 'is_admin' => false]);
    }

    public function test_multipart_updates_and_gallery_validation(): void
    {
        Storage::fake('public');
        $this->admin();
        $listing = Listing::where('slug', 'sticker-pack')->firstOrFail();
        $original = $listing->images->first();
        $this->post('/api/listings/sticker-pack', [
            '_method' => 'PATCH', 'title' => 'Multipart edit', 'tags' => '',
            'images' => [UploadedFile::fake()->image('new.png')],
            'remove_image_ids' => [$original->id],
        ], ['Accept' => 'application/json'])->assertOk()->assertJsonPath('data.title', 'Multipart edit')->assertJsonPath('data.tags', []);
        $uploaded = $listing->fresh()->images->first();
        Storage::disk('public')->assertExists($uploaded->path);
        $this->patchJson('/api/listings/sticker-pack', ['remove_image_ids' => [$uploaded->id]])->assertUnprocessable()->assertJsonValidationErrors('images');
        $foreignId = Listing::where('slug', 'preorder-graphic-tee')->first()->images->first()->id;
        $this->patchJson('/api/listings/sticker-pack', ['remove_image_ids' => [$foreignId]])->assertUnprocessable();
        $this->postJson('/api/listings', $this->payload(['images' => [UploadedFile::fake()->create('bad.txt', 1, 'text/plain')]]))->assertUnprocessable()->assertJsonValidationErrors('images.0');
        $this->deleteJson('/api/listings/sticker-pack')->assertNoContent();
        Storage::disk('public')->assertMissing($uploaded->path);
    }
}
