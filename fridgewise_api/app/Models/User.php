<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function signup($email, $password, $name)
    {
        if (empty($email) || empty($password) || empty($name)) {
            throw new \Exception('Please fill in all fields');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \Exception('Not a valid email');
        }
        if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $password)) {
            throw new \Exception('Password not strong enough');
        }

        $exists = User::query()->where('email', $email)->exists();
        if ($exists) {
            throw new \Exception('Email already exists.');
        }

        $hashedPassword = Hash::make($password);

        return User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $hashedPassword,
        ]);
    }

    public static function login($email, $password)
    {
        if (empty($email) || empty($password)) {
            throw new \Exception('Please fill in all fields');
        }

        $user = User::query()->where('email', $email)->first();
        if (!$user) {
            throw new \Exception('Incorrect email');
        }

        if (!Hash::check($password, $user->password)) {
            throw new \Exception('Incorrect password');
        }

        return $user;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
