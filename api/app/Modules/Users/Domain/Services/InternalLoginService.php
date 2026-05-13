<?php

namespace App\Modules\Users\Domain\Services;

use App\Models\User;
use App\Modules\Users\Domain\Contracts\LoginChannelContract;
use App\Modules\Users\Domain\Exceptions\InvalidCredentialsException;
use Illuminate\Support\Facades\Hash;

final class InternalLoginService implements LoginChannelContract
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function login(array $data): mixed
    {
        $user = User::query()->where('email', $data['email'] ?? null)->first();

        if ($user === null || ! Hash::check((string) ($data['password'] ?? ''), (string) $user->password)) {
            throw new InvalidCredentialsException;
        }

        return $user;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data): mixed
    {
        return User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
    }
}
