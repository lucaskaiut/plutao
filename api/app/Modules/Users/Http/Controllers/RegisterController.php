<?php

namespace App\Modules\Users\Http\Controllers;

use App\Modules\Users\Domain\Services\AuthService;
use App\Modules\Users\Http\Requests\RegisterRequest;
use App\Modules\Users\Http\Resources\LoginResource;
use Illuminate\Http\JsonResponse;

final class RegisterController
{
    public function __invoke(RegisterRequest $request, AuthService $auth): JsonResponse
    {
        $result = $auth->register(
            $request->validated('channel'),
            $request->validated('payload'),
        );

        return (new LoginResource($result))->response();
    }
}
