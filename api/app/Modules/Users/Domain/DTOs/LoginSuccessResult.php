<?php

namespace App\Modules\Users\Domain\DTOs;

use App\Models\User;

final readonly class LoginSuccessResult
{
    public function __construct(
        public User $user,
        public string $token,
    ) {}
}
