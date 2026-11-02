<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class TokenAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_cannot_promote_a_user(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Student', 'email' => 'student@example.test',
            'password' => 'test-password-123', 'is_admin' => true,
        ])->assertCreated()->assertJsonPath('user.is_admin', false)->assertJsonMissingPath('user.password');
        $this->assertDatabaseHas('users', ['email' => 'student@example.test', 'is_admin' => false]);
        $this->postJson('/api/register', [])->assertUnprocessable();
    }

    public function test_login_issues_a_hashed_expiring_token_and_logout_revokes_only_that_token(): void
    {
        $user = User::factory()->create(['password' => bcrypt('test-password-123')]);
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'incorrect'])->assertUnprocessable();
        $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'test-password-123'])
            ->assertOk()->assertJsonPath('token_type', 'Bearer')->assertJsonMissingPath('user.password');
        $token = $response->json('token');
        $stored = PersonalAccessToken::findToken($token);
        $this->assertNotNull($stored);
        $this->assertNotSame($token, $stored->token);
        $this->assertTrue($stored->expires_at->isFuture());
        $otherToken = $user->createToken('other-device')->accessToken;
        $headers = ['Authorization' => 'Bearer '.$token];
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/profile', $headers)->assertOk()->assertJsonPath('data.email', $user->email);
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/logout', [], $headers)->assertOk()->assertJsonPath('message', 'Logout success');
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $stored->id]);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $otherToken->id]);
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/profile', $headers)->assertUnauthorized();
    }

    public function test_real_bearer_tokens_obey_admin_authorization_and_expiry(): void
    {
        $this->seed();
        $student = User::factory()->create();
        $token = $student->createToken('student')->plainTextToken;
        $this->patchJson('/api/listings/sticker-pack', ['title' => 'Denied'], ['Authorization' => 'Bearer '.$token])->assertForbidden();
        $this->app['auth']->forgetGuards();
        $admin = User::factory()->create();
        $admin->is_admin = true;
        $admin->save();
        $token = $admin->createToken('admin')->plainTextToken;
        $this->patchJson('/api/listings/sticker-pack', ['title' => 'Bearer admin edit'], ['Authorization' => 'Bearer '.$token])
            ->assertOk()->assertJsonPath('data.title', 'Bearer admin edit');
        $this->app['auth']->forgetGuards();
        $expired = $admin->createToken('expired', ['*'], now()->subMinute())->plainTextToken;
        $this->getJson('/api/profile', ['Authorization' => 'Bearer '.$expired])->assertUnauthorized();
        $this->getJson('/api/profile', ['Authorization' => 'Bearer invalid'])->assertUnauthorized();
    }
}
