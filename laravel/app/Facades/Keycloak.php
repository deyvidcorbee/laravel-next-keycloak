<?php

namespace App\Facades;

use Illuminate\Support\Facades\Http;

class Keycloak
{
    private string $accessToken;

    public function __construct(public readonly string $realm)
    {
        $this->connect();
    }

    private function connect(): void
    {
        $response = Http::asForm()
            ->post(
                env('KEYCLOAK_BASE_URL') . '/realms/master/protocol/openid-connect/token',
                [
                    'grant_type'    => 'client_credentials',
                    'client_id'     => 'admin-cli',
                    'client_secret' => env('KEYCLOAK_CLI_SECRET')
                ]
            )
            ->json();

        if (isset($response['error'])) {
            throw new \Exception($response['error_description']);
        }

        $this->accessToken = $response['access_token'];
    }

    private function findUserIdByEmail(string $email): string
    {
        $user = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}"
        ])->get(
            env('KEYCLOAK_BASE_URL') . "/admin/realms/{$this->realm}/users?email=$email"
        )->json();

        if (empty($user)) {
            throw new \Exception("Nenhum usuário encontrado!", 404);
        }
        
        return $user[0]['id'];
    }

    private function updatePassword(string $userId, string $password): void
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}"
        ])->put(env('KEYCLOAK_BASE_URL') . "/admin/realms/{$this->realm}/users/$userId/reset-password", [
            "temporary" => false,
            "value"     => $password
        ]);
        
        if ($response->status() !== 204) {
            throw new \Exception("Não foi possivel criar a senha do usuário!", 500);
        }
    }

    public function createUser(string $email, string $password): string
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}"
        ])->post(env('KEYCLOAK_BASE_URL') . "/admin/realms/{$this->realm}/users", [
            "email"         => $email,
            "emailVerified" => true,
            "enabled"       => true,
            "username"      => explode('@', $email)[0]
        ]);

        if ($response->status() !== 201) {
            throw new \Exception("Erro ao cadastrar o usuário!");
        }

        $userId = $this->findUserIdByEmail($email);
        $this->updatePassword($userId, $password);

        return $userId;
    }

    public function updateUser(string $userId, array $options): void
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}"
        ])->put(env('KEYCLOAK_BASE_URL') . "/admin/realms/{$this->realm}/users/$userId", $options);

        if ($response->status() !== 204) {
            throw new \Exception("Não foi possivel alterar o usuário!", 500);
        }
    }

    public function deleteUser(string $userId): void
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}"
        ])->delete(env('KEYCLOAK_BASE_URL') . "/admin/realms/{$this->realm}/users/$userId");

        if ($response->status() !== 204) {
            throw new \Exception("Não foi possivel deletar o usuário!", 500);
        }
    }
}