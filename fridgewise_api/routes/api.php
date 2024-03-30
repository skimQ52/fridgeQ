<?php

use App\Http\Controllers\FoodController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/ping', function () {
    return response()->json(['message' => 'Pong!'], 200);
});

Route::post('/food', [FoodController::class, 'store']);
Route::get('/food', [FoodController::class, 'index']);
Route::delete('/food', [FoodController::class, 'destroy']);
Route::patch('/food', [FoodController::class, 'update']);
