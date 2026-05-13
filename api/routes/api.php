<?php

use App\Http\Controllers\HealthController;
use App\Modules\Users\Http\Controllers\LoginController;
use App\Modules\Users\Http\Controllers\MeController;
use App\Modules\Users\Http\Controllers\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::post('/login', LoginController::class);
Route::post('/register', RegisterController::class);

Route::get('/me', MeController::class)->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
