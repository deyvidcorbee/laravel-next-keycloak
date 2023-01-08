<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

# Rota publica
Route::get('/version', fn() => json_encode(['version' => 'v0.0.1']));

# Rota protegida
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/users', [UserController::class, 'listAll']);
    Route::get('/users/me', [UserController::class, 'info']);
    Route::post('/users', [UserController::class, 'create']);
    Route::delete('/users/{userId}', [UserController::class, 'delete']);
    Route::put('/users/{userId}/status', [UserController::class, 'changeStatus']);
    Route::put('/users/{userId}', [UserController::class, 'update']);
});
