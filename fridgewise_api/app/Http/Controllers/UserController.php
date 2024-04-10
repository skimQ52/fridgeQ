<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function login(Request $request)
    {

        $request->validate([
           'email' => 'required|email',
           'password' => 'required',
        ]);

        $user = User::query()->where('email', Str::lower($request->email))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $plainTextToken = $user->createToken($user->name)->plainTextToken;
        return response()->json([
            'token' => $plainTextToken,
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $hashedPass = Hash::make($validatedData['password']);

        User::query()->create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $hashedPass,
        ]);

        $user = User::query()->where('email', Str::lower($request->email))->first();

        $plainTextToken = $user->createToken($user->name)->plainTextToken;
        return response()->json([
            'token' => $plainTextToken,
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
