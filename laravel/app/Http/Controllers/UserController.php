<?php

namespace App\Http\Controllers;

use App\Facades\Keycloak;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function listAll(): JsonResponse
    {
        return response()->json(User::all());
    }

    public function create(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email|unique:users,email',
            'password' => 'required'
        ]);

        try {
            $userId = (new Keycloak(env('KEYCLOAK_REALM')))
                ->createUser($request->email, $request->password);

            $user = User::create([
                'id'    => $userId,
                'email' => $request->email,
                'name'  => explode('@', $request->email)[0]
            ]);
            empty($user) && throw new \Exception("Não foi possivel registrar o usuário!");

            return response()->json(['message' => 'Cadastro realizado com sucesso!', 'id' => $userId], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function delete(string $userId): JsonResponse
    {
        try {
            (new Keycloak(env('KEYCLOAK_REALM')))->deleteUser($userId);
            User::find($userId)->delete();

            return response()->json(['message' => 'Usuário deletado com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function changeStatus(string $userId, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:on,off'
        ]);

        try {
            (new Keycloak(env('KEYCLOAK_REALM')))
                ->updateUser($userId, ['enabled' => $request->status == 'on']);

            User::find($userId)->update(['status' => $request->status]);
            return response()->json(['message' => 'Status do usuário alterado com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function update(string $userId, Request $request): JsonResponse
    {
        $request->validate([
            'email' => "required|unique:users,email,$userId"
        ]);

        try {
            $userName = explode('@', $request->email)[0];
            (new Keycloak(env('KEYCLOAK_REALM')))
                ->updateUser($userId, ['email' => $request->email, 'username' => $userName]);

            User::find($userId)->update(['email' => $request->email, 'name' => $userName]);
            return response()->json(['message' => 'Usuário alterado com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
    
    public function info(): JsonResponse
    {
        return response()->json([
            'token' => Auth::token(),
            'user'  => Auth::user()
        ]);
    }
}
