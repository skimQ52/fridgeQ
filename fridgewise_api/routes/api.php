<?php

use App\Http\Controllers\FoodController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/user/register', function () {
    return response()->json(['message' => 'Pong!'], 200);
});

Route::post('/user/login', [UserController::class, 'login']);
Route::post('/user/register', [UserController::class, 'register']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'auth-model:user'])->group(function () {
    Route::put('/food', [FoodController::class, 'store']);
    Route::get('/food', [FoodController::class, 'index']);
    Route::delete('/food', [FoodController::class, 'destroy']);
    Route::patch('/food', [FoodController::class, 'update']);

    Route::put('/meal', [MealController::class, 'store']);
    Route::get('/meal', [MealController::class, 'index']);

    Route::put('/recipe', [RecipeController::class, 'store']);
    Route::delete('/recipe', [RecipeController::class, 'destroy']);
    Route::get('/recipe', [RecipeController::class, 'index']);
});
