<?php

namespace App\Modules\Users\Http\Requests;

use App\Modules\Users\Domain\Services\LoginChannelRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $registry = $this->container->make(LoginChannelRegistry::class);

        return [
            'channel' => ['required', 'string', Rule::in($registry->registeredChannelNames())],
            'payload' => ['required', 'array'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->sometimes('payload.email', ['required', 'string', 'email'], function (): bool {
            return $this->input('channel') === 'internal';
        });

        $validator->sometimes('payload.password', ['required', 'string'], function (): bool {
            return $this->input('channel') === 'internal';
        });
    }
}
