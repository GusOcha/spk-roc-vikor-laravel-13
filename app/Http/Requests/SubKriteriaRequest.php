<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubKriteriaRequest extends FormRequest
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
            'kriteria_id' => ['required', 'integer', 'exists:kriteria,id'],
            'deskripsi' => ['required', 'string', 'max:200'],
            'nilai' => ['required', 'numeric'],
        ];
    }
}
