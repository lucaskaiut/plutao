<?php

namespace App\Modules\Users\Domain\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvalidCredentialsException extends Exception
{
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Invalid credentials.',
            'errors' => [
                'credentials' => [
                    'The provided credentials are incorrect.',
                ],
            ],
        ], 401);
    }
}
