<?php

namespace App\Modules\Users\Domain\Contracts;

interface LoginChannelContract
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function login(array $data): mixed;
}
