<?php

namespace App\Modules\Users\Domain\Services;

use App\Models\User;
use App\Modules\Users\Domain\DTOs\LoginSuccessResult;

final class AuthService
{
    public function __construct(
        private LoginChannelRegistry $registry,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public function login(string $channel, array $payload): mixed
    {
        $handler = $this->registry->resolve($channel);
        $authenticated = $handler->login($payload);

        if (! $authenticated instanceof User) {
            throw new \LogicException('Login channel must return a '.User::class.' instance.');
        }

        $token = $authenticated->createToken('login')->plainTextToken;

        return new LoginSuccessResult($authenticated, $token);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function register(string $channel, array $payload): mixed
    {
        $handler = $this->registry->resolve($channel);
        $registered = $handler->register($payload);

        if (! $registered instanceof User) {
            throw new \LogicException('Register channel must return a '.User::class.' instance.');
        }

        $token = $registered->createToken('register')->plainTextToken;

        return new LoginSuccessResult($registered, $token);
    }
}
