<?php

namespace App\Modules\Users\Http\Resources;

use App\Modules\Users\Domain\DTOs\LoginSuccessResult;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin LoginSuccessResult
 */
class LoginResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var LoginSuccessResult $result */
        $result = $this->resource;

        return [
            'data' => [
                'token' => $result->token,
                'user' => [
                    'id' => $result->user->id,
                    'name' => $result->user->name,
                    'email' => $result->user->email,
                ],
            ],
        ];
    }
}
