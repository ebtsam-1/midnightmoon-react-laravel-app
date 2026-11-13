<?php

namespace Database\Seeders;

use App\Models\Report;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          Report::upsert(
            [
                [
                    "id" => 1,
                    "title" => "01-Jia'ao_Verra-Listing-Representation-Single Representator",
                    "type" => "Sheet",
                    "status" => "Approved",
                    "project_id" => 1
                ],
                [
                    "id" => 2,
                    "title" => "VCU-Conversion-Deed-of-Representation-v4.2 (VIET 1)",
                    "type" => "Sheet",
                    "status" => "draft",
                    "project_id" => 1
                ],
                [
                    "id" => 3 ,
                    "title" => "ERS MP 01062020 31122020",
                    "type" => "Sheet",
                    "status" => "In review",
                    "project_id" => 1
                ],
                [
                    "id" => 4,
                    "title" => "ANREU Voluntary Cancellation",
                    "type" => "Sheet",
                    "status" => "Approved",
                    "project_id" => 2
                ],
                [
                    "id" => 5,
                    "title" => "PAMER MP 01062020 31122020",
                    "type" => "Sheet",
                    "status" => "draft",
                    "project_id" => 2
                ],
                [
                    "id" => 6,
                    "title" => "Deed-of-Representation-v4.2 (VIET 1)",
                    "type" => "Sheet",
                    "status" => "In review",
                    "project_id" => 3
                ],
                [
                    "id" => 7,
                    "title" => "ANREU Voluntary Registration",
                    "type" => "Sheet",
                    "status" => "Approved",
                    "project_id" => 4
                ],
                [
                    "id" =>8,
                    "title" => "Listing-Representation-Single Representator",
                    "type" => "Sheet",
                    "status" => "draft",
                    "project_id" => 5
                ],
                [
                    "id" => 9,
                    "title" => "02-Jia'ao_Verra-Listing-Representation-Single Representator",
                    "type" => "Sheet",
                    "status" => "In review",
                    "project_id" => 6
                ],
                [
                    "id" => 10,
                    "title" => "Lorem Apple orane",
                    "type" => "Sheet",
                    "status" => "Approved",
                    "project_id" => 8
                ],
                
            ],
            ["id"],
            ["title", "type", "status"]
        );
    }
}
