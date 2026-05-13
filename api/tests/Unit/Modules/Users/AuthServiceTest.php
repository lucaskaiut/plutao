<?php

namespace Tests\Unit\Modules\Users;

use App\Models\User;
use App\Modules\Users\Domain\Contracts\LoginChannelContract;
use App\Modules\Users\Domain\DTOs\LoginSuccessResult;
use App\Modules\Users\Domain\Services\AuthService;
use App\Modules\Users\Domain\Services\LoginChannelRegistry;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Sanctum\PersonalAccessToken;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_login_delegates_payload_to_resolved_handler_without_transforming_keys(): void
    {
        $user = Mockery::mock(User::class);
        $accessToken = Mockery::mock(PersonalAccessToken::class);
        $newToken = new NewAccessToken($accessToken, 'plain-api-token');

        $user->shouldReceive('createToken')
            ->once()
            ->with('login')
            ->andReturn($newToken);

        $handler = Mockery::mock(LoginChannelContract::class);
        $handler->shouldReceive('login')
            ->once()
            ->with([
                'email' => 'handler@example.com',
                'password' => 'plain',
            ])
            ->andReturn($user);

        $registry = Mockery::mock(LoginChannelRegistry::class);
        $registry->shouldReceive('resolve')
            ->once()
            ->with('internal')
            ->andReturn($handler);

        $service = new AuthService($registry);
        $result = $service->login('internal', [
            'email' => 'handler@example.com',
            'password' => 'plain',
        ]);

        $this->assertInstanceOf(LoginSuccessResult::class, $result);
        $this->assertSame($user, $result->user);
        $this->assertSame('plain-api-token', $result->token);
    }
}
