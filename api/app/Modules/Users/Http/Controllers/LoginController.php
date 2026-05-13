<?php

namespace App\Modules\Users\Http\Controllers;

use App\Modules\Users\Domain\Services\AuthService;
use App\Modules\Users\Http\Requests\LoginRequest;
use App\Modules\Users\Http\Resources\LoginResource;
use Illuminate\Http\JsonResponse;

final class LoginController
{
    public function __invoke(LoginRequest $request, AuthService $auth): JsonResponse
    {
        $result = $auth->login(
            $request->validated('channel'),
            $request->validated('payload'),
        );

        return (new LoginResource($result))->response();
    }
}
