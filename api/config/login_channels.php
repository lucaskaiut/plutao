<?php

use App\Modules\Users\Domain\Contracts\LoginChannelContract;
use App\Modules\Users\Domain\Services\InternalLoginService;

return [

    /**
     * Mapa de canais de login para classes que implementam LoginChannelContract.
     * Novos canais (customer, admin, external, mobile) podem ser registrados aqui.
     *
     * @var array<string, class-string<LoginChannelContract>>
     */
    'channels' => [
        'internal' => InternalLoginService::class,
    ],

];
