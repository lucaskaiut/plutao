<?php

namespace App\Modules\Users\Domain\Contracts;

interface LoginChannelContract
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function login(array $data): mixed;

    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data): mixed;
}
