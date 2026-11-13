<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Feature;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Feature::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'Feat one',
                'desc' => 'lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum',
                'img' => 'features/3.jpg'
            ]
        );
        Feature::updateOrCreate(
            ['id' => 2],
            [
                'title' => 'Feat two',
                'desc' => 'lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum',
                'img' => 'features/4.jpg'
            ]
        );
        Feature::updateOrCreate(
            ['id' => 3],
            [
                'title' => 'Feat 3',
                'desc' => 'lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum',
                'img' => 'features/2.jpg'
            ]
        );
        Feature::updateOrCreate(
            ['id' => 4],
            [
                'title' => 'Feat Four',
                'desc' => 'lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsum',
                'img' => 'features/5.jpg'
            ]
        );
    }
}
