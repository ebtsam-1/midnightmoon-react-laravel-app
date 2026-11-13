<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:150'],
            'description' => ['required', 'string', 'min:5', 'max:250'],
            'price' => ['required'],
            'specifications' => ['required', 'array', 'min:1'],
            'primary_image' => ['required', 'image', 'mimes:jpeg,png,jpg'],
            'images' => ['array', 'min:1'],
            'images.*' => ['required','image', 'mimes:jpeg,png,jpg'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}
