<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\CategorySeeder;
use Database\Seeders\FeatureSeeder;
use Database\Seeders\ImageSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\ProjectSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        $admin = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'avatar' => 'avatars/avatar.jpg',
        ]);

        $admin->assignRole('admin');

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            ImageSeeder::class,
            FeatureSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}