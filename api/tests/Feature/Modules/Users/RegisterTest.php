<?php

namespace Tests\Feature\Modules\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    private function registerUrl(): string
    {
        return '/api/register';
    }

    public function test_happy_path_internal_register_returns_sanctum_token_and_user(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'name' => 'Jane Doe',
                'email' => 'jane@example.com',
                'password' => 'secret-password',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.user.name', 'Jane Doe')
            ->assertJsonPath('data.user.email', 'jane@example.com');

        $userId = $response->json('data.user.id');
        $this->assertIsInt($userId);

        $token = $response->json('data.token');
        $this->assertIsString($token);
        $this->assertNotSame('', $token);

        $this->assertDatabaseHas('users', [
            'id' => $userId,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ]);

        $user = User::query()->findOrFail($userId);
        $this->assertTrue(Hash::check('secret-password', (string) $user->password));

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $userId,
        ]);
    }

    public function test_validation_fails_when_channel_is_missing_on_register(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'payload' => [
                'name' => 'A',
                'email' => 'a@b.com',
                'password' => 'x',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['channel']);
    }

    public function test_validation_fails_when_channel_is_not_supported_on_register(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'unknown-channel-xyz',
            'payload' => [],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['channel']);
    }

    public function test_validation_fails_when_payload_is_missing_on_register(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);
    }

    public function test_validation_fails_when_payload_is_not_array_on_register(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => 'not-an-array',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload']);
    }

    public function test_validation_fails_when_internal_register_name_is_missing(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'email' => 'a@b.com',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.name']);
    }

    public function test_validation_fails_when_internal_register_email_is_missing(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'name' => 'Jane',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.email']);
    }

    public function test_validation_fails_when_internal_register_email_is_invalid(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'name' => 'Jane',
                'email' => 'not-an-email',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.email']);
    }

    public function test_validation_fails_when_internal_register_email_is_not_unique(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'name' => 'Jane',
                'email' => 'taken@example.com',
                'password' => 'secret',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.email']);
    }

    public function test_validation_fails_when_internal_register_password_is_missing(): void
    {
        $response = $this->postJson($this->registerUrl(), [
            'channel' => 'internal',
            'payload' => [
                'name' => 'Jane',
                'email' => 'jane@example.com',
            ],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payload.password']);
    }
}
