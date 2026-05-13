<?php

namespace Tests\Feature\Modules\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    private function loginUrl(): string
    {
        return '/api/login';
    }

    public function test_happy_path_internal_login_returns_sanctum_token_and_user(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('secret'),
        ]);

        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'admin@example.com',
                'password' => 'secret',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.name', $user->name)
            ->assertJsonPath('data.user.email', 'admin@example.com');

        $token = $response->json('data.token');
        $this->assertIsString($token);
        $this->assertNotSame('', $token);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_validation_fails_when_channel_is_missing(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'payload' => ['email' => 'a@b.com', 'password' => 'x'],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['channel']);
    }

    public function test_validation_fails_when_channel_is_not_supported(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'unknown-channel-xyz',
            'payload' => [],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['channel']);
    }

    public function test_validation_fails_when_payload_is_missing(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);
    }

    public function test_validation_fails_when_payload_is_not_array(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => 'not-an-array',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);
    }

    public function test_validation_fails_when_internal_email_is_missing(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.email']);
    }

    public function test_validation_fails_when_internal_email_is_invalid(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'not-an-email',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.email']);
    }

    public function test_validation_fails_when_internal_password_is_missing(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'admin@example.com',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.password']);
    }

    public function test_authentication_fails_when_email_does_not_exist(): void
    {
        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'nobody@example.com',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnauthorized()
            ->assertJsonStructure(['message', 'errors']);

        $this->assertArrayHasKey('credentials', $response->json('errors'));
    }

    public function test_authentication_fails_when_password_is_incorrect(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('correct'),
        ]);

        $response = $this->postJson($this->loginUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'admin@example.com',
                'password' => 'wrong-password',
            ],
        ]);

        $response->assertUnauthorized()
            ->assertJsonStructure(['message', 'errors']);

        $this->assertArrayHasKey('credentials', $response->json('errors'));
    }
}
