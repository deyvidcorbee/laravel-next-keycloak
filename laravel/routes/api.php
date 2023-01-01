<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

# Rota publica
Route::get('/version', fn() => json_encode(['version' => 'v0.0.1']));

# Rota protegida
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/user-info', 'UserController@info');
});
