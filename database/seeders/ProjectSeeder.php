<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::upsert(
            [
                [
                    "id" => 1,
                    "title" => "Riverside Mobile App",
                    "description" => "Customer-facing mobile app for booking and managing riverside rentals, with push notifications and offline support.",
                    "image" => "projects/1.jpg",
                ],
                [
                    "id" => 2,
                    "title" => "Inventory Sync Service",
                    "description" => "Background service that keeps stock levels in sync between the warehouse system and the online store.",
                    "image" => "projects/2.jpg",
                ],
                [
                    "id" => 3,
                    "title" => "Loyalty Points Engine",
                    "description" => "Rules engine for earning, expiring and redeeming loyalty points across all sales channels.",
                    "image" => "projects/3.jpg",
                ],
                [
                    "id" => 4,
                    "title" => "Admin Dashboard Rebuild",
                    "description" => "Rebuild of the internal admin dashboard with faster tables, role-based access and better filtering.",
                    "image" => "projects/4.jpg",
                ],
                [
                    "id" => 5,
                    "title" => "Payments Gateway Upgrade",
                    "description" => "Migration to the new payment provider API, including refunds, webhooks and reconciliation reports.",
                    "image" => "projects/5.jpg",
                ],
                [
                    "id" => 6,
                    "title" => "OTP Verification Flow",
                    "description" => "One-time password login and verification for sign-up, password reset and sensitive account changes.",
                    "image" => "projects/6.jpg",
                ],
                [
                    "id" => 7,
                    "title" => "Reporting Warehouse",
                    "description" => "Central reporting database that collects sales, support and marketing data for scheduled reports.",
                    "image" => "projects/7.jpg",
                ],
                [
                    "id" => 8,
                    "title" => "Customer Support Portal",
                    "description" => "Self-service portal where customers can open tickets, track their status and browse help articles.",
                    "image" => "projects/8.jpg",
                ],
                [
                    "id" => 9,
                    "title" => "Marketing Site Refresh",
                    "description" => "New landing pages, improved page speed and a simpler content workflow for the marketing team.",
                    "image" => "projects/9.jpg",
                ],
                [
                    "id" => 10,
                    "title" => "Data Privacy Hardening",
                    "description" => "Encryption of personal data at rest, audit logging and retention rules for customer records.",
                    "image" => "projects/10.jpg",
                ],
                [
                    "id" => 11,
                    "title" => "Delivery Tracking",
                    "description" => "Live delivery status for customers, with driver updates and estimated arrival times.",
                    "image" => "projects/11.jpg",
                ],
                [
                    "id" => 12,
                    "title" => "Notification Center",
                    "description" => "Unified email, SMS and in-app notifications with per-user preferences and delivery logs.",
                    "image" => "projects/12.jpg",
                ],
                [
                    "id" => 13,
                    "title" => "Partner API",
                    "description" => "Public REST API for partners, with API keys, rate limiting and versioned documentation.",
                    "image" => "projects/13.jpg",
                ],
                [
                    "id" => 14,
                    "title" => "Performance Audit",
                    "description" => "Profiling of slow endpoints and queries, followed by caching and indexing improvements.",
                    "image" => "projects/14.jpg",
                ],
            ],
            ["id"],
            ["title", "description", "image"]
        );
    }
}
