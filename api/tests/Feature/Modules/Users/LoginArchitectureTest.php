<?php

namespace Tests\Feature\Modules\Users;

use App\Modules\Users\Domain\Contracts\LoginChannelContract;
use App\Modules\Users\Domain\Services\InternalLoginService;
use App\Modules\Users\Http\Controllers\LoginController;
use App\Modules\Users\Http\Controllers\RegisterController;
use Tests\TestCase;

class LoginArchitectureTest extends TestCase
{
    public function test_controller_does_not_contain_authentication_business_rules(): void
    {
        $path = (new \ReflectionClass(LoginController::class))->getFileName();
        $this->assertNotFalse($path);
        $contents = file_get_contents($path);
        $this->assertIsString($contents);
        $this->assertStringNotContainsString('Auth::attempt', $contents);
        $this->assertStringNotContainsString('Hash::check', $contents);
    }

    public function test_internal_login_service_implements_login_channel_contract(): void
    {
        $service = new InternalLoginService;
        $this->assertInstanceOf(LoginChannelContract::class, $service);
    }

    public function test_register_controller_does_not_contain_user_persistence_rules(): void
    {
        $path = (new \ReflectionClass(RegisterController::class))->getFileName();
        $this->assertNotFalse($path);
        $contents = file_get_contents($path);
        $this->assertIsString($contents);
        $this->assertStringNotContainsString('User::create', $contents);
        $this->assertStringNotContainsString('User::query()->create', $contents);
    }
}
