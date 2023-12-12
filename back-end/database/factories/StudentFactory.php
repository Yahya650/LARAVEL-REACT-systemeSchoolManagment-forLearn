<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Student;
use Nette\Utils\Random;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    
    {

        $generate_userName = Str::random(8);
        while (Student::where('user_name', $generate_userName)->exists()) {
            $generate_userName = Str::random(8);
        }
        return [
            'name' => fake()->name(),
            'sexe' => fake()->randomElement(['Female', 'Male']),
            // 'email' => fake()->unique()->safeEmail(),
            'user_name' => $generate_userName . '@stuednt.ma',
            // 'email_verified_at' => now(),    
            'password' => Hash::make('12345678'), // 12345678
            'remember_token' => Str::random(60),
            'admin_id' => Admin::all()->random(),
        ];
    }
}
