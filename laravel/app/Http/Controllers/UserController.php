<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function info(): JsonResponse
    {
        return response()->json([
            'token' => Auth::token(),
            'user'  => Auth::user()
        ]);
    }
}
