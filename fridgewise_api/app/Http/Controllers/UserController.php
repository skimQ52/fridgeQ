<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function login(Request $request)
    {

        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        /** @var User $user */
        $user = User::query()->where('email', Str::lower($validated['email']))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ]);
        }

        $plainTextToken = $user->createToken($request->device_name)->plainTextToken;
        return response()->json([
            'id' => $user->id,
            'token' => $plainTextToken,
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:8',
            'device_name' => 'required',
        ]);

        if (User::query()->where('email', $validatedData['email'])->exists()) {
            return response()->json([
                'message' => 'Email is already taken.'
            ], 422);
        }

        $hashedPass = Hash::make($validatedData['password']);

        $user = User::query()->create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $hashedPass,
        ]);

        $plainTextToken = $user->createToken($request->device_name)->plainTextToken;
        return response()->json([
            'id' => $user->id,
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
