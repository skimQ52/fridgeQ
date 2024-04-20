<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class FoodController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user_id = $request->user()->_id;
            $foodName = $request->query('name');

            if ($foodName) {
                $food = Food::query()
                    ->where('name', $foodName)
                    ->where('user_id', $user_id)
                    ->first();
                return response()->json(['data' => $food]);
            }
            $foods = Food::query()
                ->where('user_id', $user_id)
                ->get();
            return response()->json(['data' => $foods]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
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

            $user_id = $request->user()->_id;

            $food = Food::query()
                ->where('name', $validated['name'])
                ->where('user_id', $user_id)
                ->first();
            if ($food) {
                $food->update([
                    'quantity' => $validated['quantity'],
                ]);
                return response()->json(['data' => $food]);
            }

            $food = Food::query()->create([
                'name' => $validated['name'],
                'quantity' => $validated['quantity'],
                'type' => $validated['type'],
                'user_id' => $user_id,
            ]);
            return response()->json(['data' => $food]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            $user_id = $request->user()->_id;
            $name = $request->input('name');
            $quan = $request->input('quan');

            $food = Food::query()
                ->where('name', $name)
                ->where('user_id', $user_id)
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $user_id = $request->user()->_id;
            $name = $request->input("name");
            $food = Food::query()
                ->where('name', $name)
                ->where('user_id', $user_id)
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
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
