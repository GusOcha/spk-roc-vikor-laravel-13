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
     * The full decision matrix: penilaian[alternatif_id][kriteria_id] = nilai.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'penilaian' => ['required', 'array'],
            'penilaian.*' => ['array'],
            'penilaian.*.*' => ['nullable', 'numeric'],
        ];
    }
}
