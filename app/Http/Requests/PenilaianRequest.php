<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PenilaianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    /**
     * Scores for a single alternative across every criterion.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'alternatif_id' => ['required', 'integer', 'exists:alternatif,id'],
            'nilai' => ['required', 'array'],
            'nilai.*' => ['required', 'numeric'],
        ];
    }
}
