<?php

namespace App\Providers;

use App\Modules\Users\Domain\Services\LoginChannelRegistry;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginChannelRegistry::class, function (Application $app): LoginChannelRegistry {
            /** @var array<string, class-string> $channels */
            $channels = config('login_channels.channels', []);

            return new LoginChannelRegistry($app, $channels);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
