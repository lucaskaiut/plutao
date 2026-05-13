<?php

namespace App\Modules\Users\Http\Controllers;

use App\Modules\Users\Http\Resources\MeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MeController
{
    public function __invoke(Request $request): JsonResponse
    {
        return (new MeResource($request->user()))->response();
    }
}
