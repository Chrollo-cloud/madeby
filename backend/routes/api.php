<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CatalogueController;
use App\Http\Controllers\ListingController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::get('/listings', [ListingController::class, 'index']);
Route::get('/products', [ListingController::class, 'index'])->defaults('type', 'product');
Route::get('/commissions', [ListingController::class, 'index'])->defaults('type', 'commission');
Route::get('/listings/{listing}', [ListingController::class, 'show']);
Route::get('/categories', [CatalogueController::class, 'categories']);
Route::get('/creators', [CatalogueController::class, 'creators']);
Route::get('/creators/{creator}', [CatalogueController::class, 'creator']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $r) => new UserResource($r->user()));
    Route::post('/listings', [ListingController::class, 'store']);
    Route::match(['put', 'patch'], '/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);
});
