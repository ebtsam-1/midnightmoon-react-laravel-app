<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    public function run(): void
    {
        // slug => title map — must match the slugs/titles used in ProductSeeder
        $products = [
            'aurora' => 'Aurora Wireless Headphones',
            'pulse' => 'Pulse Smartwatch',
            'keystone' => 'Keystone Mechanical Keyboard',
            'vista' => 'Vista 27" 4K Monitor',
            'lift' => 'Lift Aluminum Laptop Stand',
            'clearview' => 'ClearView 1080p Webcam',
            'echo' => 'Echo Mini Portable Speaker',
            'glide' => 'Glide Wireless Gaming Mouse',
            'charge' => 'Charge+ 20,000 mAh Power Bank',
            'slate' => 'Slate 11" Tablet',
            'ink' => 'Ink Paper E-Reader',
            'halo' => 'Halo Smart Desk Lamp',
        ];

        foreach ($products as $slug => $title) {
            $product = Product::where('title', $title)->first();

            if (! $product) {
                continue; // ProductSeeder hasn't been run yet
            }

            // 3 gallery images per product, matching the frontend's
            // gallery(slug) helper: picsum.photos/seed/{slug}-{n}/900/675
            for ($i = 1; $i <= 3; $i++) {
                $product->images()->create([
                    'path' => "https://picsum.photos/seed/{$slug}-{$i}/900/675",
                    'disk' => 'external',
                    'order' => $i,
                    'is_primary' => $i === 1,
                ]);
            }
        }
    }
}