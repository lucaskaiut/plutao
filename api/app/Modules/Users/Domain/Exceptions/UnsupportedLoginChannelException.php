<?php

namespace App\Modules\Users\Domain\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnsupportedLoginChannelException extends Exception
{
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Unsupported login channel.',
            'errors' => [
                'channel' => [
                    'The selected channel is not supported.',
                ],
            ],
        ], 422);
    }
}
