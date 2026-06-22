<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KriteriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'kode' => ['required', 'string', 'max:20'],
            'keterangan' => ['required', 'string', 'max:150'],
            'jenis' => ['required', Rule::in(['benefit', 'cost'])],
            'prioritas' => ['required', 'integer', 'min:1'],
        ];
    }
}
