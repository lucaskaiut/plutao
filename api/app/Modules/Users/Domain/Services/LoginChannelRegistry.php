<?php

namespace App\Modules\Users\Domain\Services;

use App\Modules\Users\Domain\Contracts\LoginChannelContract;
use App\Modules\Users\Domain\Exceptions\UnsupportedLoginChannelException;
use Illuminate\Contracts\Container\Container;

class LoginChannelRegistry
{
    /**
     * @param  array<string, class-string<LoginChannelContract>>  $channelMap
     */
    public function __construct(
        private Container $container,
        private array $channelMap,
    ) {}

    /**
     * @return list<string>
     */
    public function registeredChannelNames(): array
    {
        return array_keys($this->channelMap);
    }

    public function resolve(string $channel): LoginChannelContract
    {
        if (! isset($this->channelMap[$channel])) {
            throw new UnsupportedLoginChannelException("Login channel [{$channel}] is not registered.");
        }

        $concrete = $this->channelMap[$channel];

        return $this->container->make($concrete);
    }
}
