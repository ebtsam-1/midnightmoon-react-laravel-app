<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');;


Route::group(['middleware' => ['auth:sanctum']], function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class,'myInfo']);
    Route::resource('users', UserController::class);
    Route::resource('features', FeatureController::class);
    Route::resource('activities', ActivityController::class);
    Route::resource('projects', ProjectController::class);
    Route::resource('reports', ReportController::class);
    Route::resource('products', ProductController::class);

    Route::post('/projects/{project}/assign', [ProjectController::class, 'assign']);
    Route::get('/projects/{project}/reports', [ReportController::class, 'indexByProject']);

    Route::get('categories', [ProductController::class, 'categories']);
});



