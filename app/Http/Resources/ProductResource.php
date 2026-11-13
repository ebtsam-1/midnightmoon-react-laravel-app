<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'primaryImage' => $this->primaryImage[0],
            'price' => $this->price,
            'category' => $this->category->name,
            'specifications' => $this->specifications,
            'created_at' => $this->created_at->format('d-m-y'),
        ];
    }
}
