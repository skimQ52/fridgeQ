<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            $foodName = $request->query('name');

            if ($foodName) {
                $food = $user->foods()
                    ->where('name', $foodName)
                    ->first();
                return response()->json(['data' => $food]);
            }

            $foods = $user->foods()->get();

            return response()->json(['data' => $foods]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'string|required|max:25',
                'quantity' => 'numeric|required|between:1,99',
                'type' => 'string|in:fruits,vegetables,proteins,snacks,condiments,grains,dairy'
            ], [
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a string.',
                'name.unique' => 'The name has already been taken.',
                'name.max' => 'The name may not be greater than 25 characters.',
                'quantity.required' => 'The quantity field is required.',
                'quantity.numeric' => 'The quantity must be a number.',
                'quantity.between' => 'The quantity must be between 1 and 99.',
                'type.string' => 'The type must be a string.',
                'type.in' => 'The selected type is invalid.',
            ]);

            /** @var User $user */
            $user = auth()->user();

            $food = $user->foods()
                ->where('name', $validated['name'])
                ->first();

            if ($food) {
                $food->update([
                    'quantity' => $food->quantity + $validated['quantity'],
                ]);
                return response()->json(['data' => $food]);
            }

            $food = $user->foods()->create([
                'name' => $validated['name'],
                'quantity' => $validated['quantity'],
                'type' => $validated['type'],
            ]);
            return response()->json(['data' => $food]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            $name = $request->input('name');
            $quan = $request->input('quan');

            $food = $user->foods()
                ->where('name', $name)
                ->where('user_id', $user->id)
                ->first();
            if (!$food) {
                return response()->json([
                    'data' => [
                        'message' => 'User does not have the food: ' . $name
                    ],
                ]);
            }

            $food->update(['quantity' => $quan]);
            return response()->json([
                'data' => [
                    'message' => $name . ' updated successfully'
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            $name = $request->input("name");
            $food = $user->foods()
                ->where('name', $name)
                ->first();
            if (!$food) {
                return response()->json([
                    'data' => [
                        'message' => 'User does not have the food: '. $name
                    ]
                ]);
            }
            $food->delete();
            return response()->json([
                'data' => [
                    'message' => $name.' deleted successfully'
                ]
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
