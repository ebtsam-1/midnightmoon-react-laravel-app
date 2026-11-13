<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // products.user_id is NOT NULL, so we need an owner to assign.
        // Swap this for a specific admin/seller user if you have one.
        $user = User::first() ?? User::factory()->create();

        $products = [
            [
                'slug' => 'aurora',
                'title' => 'Aurora Wireless Headphones',
                'category' => 'Audio',
                'price' => 129,
                'description' => 'Over-ear headphones with active noise cancelling and a soft, breathable fit. Built for long flights, long workdays and everything in between.',
                'specs' => [
                    'Battery life' => '40 hours',
                    'Noise cancelling' => 'Active (ANC)',
                    'Connectivity' => 'Bluetooth 5.3',
                    'Weight' => '250 g',
                    'Charging' => 'USB-C',
                ],
            ],
            [
                'slug' => 'pulse',
                'title' => 'Pulse Smartwatch',
                'category' => 'Wearables',
                'price' => 199,
                'description' => 'A bright AMOLED smartwatch that tracks your workouts, sleep and heart rate, and lasts a full week between charges.',
                'specs' => [
                    'Display' => '1.4" AMOLED',
                    'Battery life' => '7 days',
                    'Water resistance' => '5 ATM',
                    'Sensors' => 'Heart rate, SpO2, GPS',
                    'Compatibility' => 'Android and iOS',
                ],
            ],
            [
                'slug' => 'keystone',
                'title' => 'Keystone Mechanical Keyboard',
                'category' => 'Accessories',
                'price' => 89,
                'description' => 'A compact 75% keyboard with hot-swappable switches, so you can change how it feels without soldering. Connects to up to three devices.',
                'specs' => [
                    'Switches' => 'Hot-swappable, brown',
                    'Layout' => '75%',
                    'Connectivity' => 'Bluetooth and 2.4 GHz',
                    'Backlight' => 'RGB per key',
                    'Battery' => '4000 mAh',
                ],
            ],
            [
                'slug' => 'vista',
                'title' => 'Vista 27" 4K Monitor',
                'category' => 'Displays',
                'price' => 379,
                'description' => 'A sharp 4K IPS monitor with accurate color for design and photo work, plus a USB-C port that charges your laptop while it displays.',
                'specs' => [
                    'Resolution' => '3840 × 2160',
                    'Panel' => 'IPS',
                    'Refresh rate' => '60 Hz',
                    'Color coverage' => '99% sRGB',
                    'Ports' => 'HDMI 2.0, USB-C 65 W',
                ],
            ],
            [
                'slug' => 'lift',
                'title' => 'Lift Aluminum Laptop Stand',
                'category' => 'Accessories',
                'price' => 39,
                'description' => 'A sturdy aluminum stand that raises your screen to eye level and lets heat escape. Folds flat to slip into a bag.',
                'specs' => [
                    'Material' => 'Aluminum alloy',
                    'Height' => '6 adjustable levels',
                    'Fits' => '10–17" laptops',
                    'Weight' => '780 g',
                    'Foldable' => 'Yes',
                ],
            ],
            [
                'slug' => 'clearview',
                'title' => 'ClearView 1080p Webcam',
                'category' => 'Video',
                'price' => 59,
                'description' => 'A plug-and-play webcam with autofocus and two noise-reducing microphones, so you look and sound clear on every call.',
                'specs' => [
                    'Resolution' => '1080p at 30 fps',
                    'Field of view' => '90°',
                    'Microphone' => 'Dual, noise-reducing',
                    'Autofocus' => 'Yes',
                    'Connection' => 'USB-A',
                ],
            ],
            [
                'slug' => 'echo',
                'title' => 'Echo Mini Portable Speaker',
                'category' => 'Audio',
                'price' => 69,
                'description' => 'A pocket-sized speaker with loud, balanced sound. Dust-proof and waterproof, so it comes along to the beach and the pool.',
                'specs' => [
                    'Battery life' => '12 hours',
                    'Water resistance' => 'IP67',
                    'Output' => '20 W',
                    'Bluetooth' => '5.2',
                    'Weight' => '540 g',
                ],
            ],
            [
                'slug' => 'glide',
                'title' => 'Glide Wireless Gaming Mouse',
                'category' => 'Accessories',
                'price' => 74,
                'description' => 'A lightweight wireless mouse with a high-precision sensor and six programmable buttons, tuned for fast, accurate control.',
                'specs' => [
                    'Sensor' => '26,000 DPI',
                    'Weight' => '58 g',
                    'Battery life' => '70 hours',
                    'Buttons' => '6 programmable',
                    'Connectivity' => '2.4 GHz and Bluetooth',
                ],
            ],
            [
                'slug' => 'charge',
                'title' => 'Charge+ 20,000 mAh Power Bank',
                'category' => 'Power',
                'price' => 45,
                'description' => 'A high-capacity power bank that can charge a laptop, a phone and earbuds at the same time.',
                'specs' => [
                    'Capacity' => '20,000 mAh',
                    'Output' => '65 W USB-C PD',
                    'Ports' => '2 USB-C, 1 USB-A',
                    'Weight' => '430 g',
                    'Recharge time' => '3.5 hours',
                ],
            ],
            [
                'slug' => 'slate',
                'title' => 'Slate 11" Tablet',
                'category' => 'Tablets',
                'price' => 449,
                'description' => 'A smooth 120 Hz tablet for reading, sketching and streaming, with enough battery for a full day away from the charger.',
                'specs' => [
                    'Display' => '11" 120 Hz LCD',
                    'Storage' => '128 GB',
                    'Battery life' => '10 hours',
                    'Processor' => 'Octa-core',
                    'Cameras' => '13 MP rear, 8 MP front',
                ],
            ],
            [
                'slug' => 'ink',
                'title' => 'Ink Paper E-Reader',
                'category' => 'Readers',
                'price' => 139,
                'description' => 'A glare-free E Ink reader with an adjustable warm light. Waterproof, and the battery lasts for weeks.',
                'specs' => [
                    'Display' => '6.8" E Ink',
                    'Backlight' => 'Adjustable warm light',
                    'Storage' => '16 GB',
                    'Battery life' => 'Up to 10 weeks',
                    'Water resistance' => 'IPX8',
                ],
            ],
            [
                'slug' => 'halo',
                'title' => 'Halo Smart Desk Lamp',
                'category' => 'Lighting',
                'price' => 55,
                'description' => 'A slim desk lamp with adjustable brightness and color temperature, controlled by touch or from your phone.',
                'specs' => [
                    'Brightness' => '800 lumens',
                    'Color temperature' => '2700–6500 K',
                    'Control' => 'App and touch',
                    'Power' => '12 W',
                    'Cable' => '1.5 m USB-C',
                ],
            ],
        ];

        foreach ($products as $data) {
            $category = Category::where('name', $data['category'])->first();

            Product::create([
                'title' => $data['title'],
                // legacy single-image column — kept in sync with the first
                // gallery image created by ImageSeeder
                'image' => "products/{$data['slug']}-1.jpg",
                'price' => $data['price'],
                'user_id' => $user->id,
                'category_id' => $category->id,
                'description' => $data['description'],
                'specifications' => $data['specs'],
            ]);
        }
    }
}