<?php

namespace Database\Seeders;

use App\Facades\Keycloak;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $userId = (new Keycloak(env('KEYCLOAK_REALM')))
                ->createUser('deyvid@corbee.com.br', 'abc@123ddc');

        User::create([
            'id'    => $userId,
            'email' => 'deyvid@corbee.com.br',
            'name'  => 'deyvid'
        ]);
    }
}
