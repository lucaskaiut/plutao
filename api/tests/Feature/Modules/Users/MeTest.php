<?php

namespace Tests\Feature\Modules\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MeTest extends TestCase
{
    use RefreshDatabase;

    private function meUrl(): string
    {
        return '/api/me';
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create([
            'name' => 'Me User',
            'email' => 'me@example.com',
        ]);

        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson($this->meUrl());

        $response->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.name', 'Me User')
            ->assertJsonPath('data.user.email', 'me@example.com');
    }

    public function test_me_returns_unauthorized_when_not_authenticated(): void
    {
        $response = $this->getJson($this->meUrl());

        $response->assertUnauthorized()
            ->assertJsonStructure(['message']);
    }
}
