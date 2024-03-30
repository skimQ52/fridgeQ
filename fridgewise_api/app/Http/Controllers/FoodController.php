<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $foodName = $request->query('name');

            if ($foodName) {
                $food = Food::query()->where('name', $foodName)->first(); // todo: where user_id
                return response()->json(['data' => $food], 200);
            }
            $foods = Food::query()->get(); // todo: where user_id
            return response()->json(['data' => $foods], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'string|required|unique:posts|max:25',
                'quantity' => 'numeric|required|between:1,99',
                'type' => 'string|in:fruit,vegetable,proteins,snacks,condiments,grains'
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

            //TODO: check for existing food with name and call update instead

//            $data['user_id'] = $request->user()->_id;
            $food = Food::query()->create([
                'name' => $validated['name'],
                'quantity' => $validated['quantity'],
                'type' => $validated['type'],
                'user_id' => "TEMPUSERID1231412312412312", //todo: Fix user id to real
            ]);
            return response()->json(['data' => $food], 200);
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
//            $user_id = $request->user()->_id; // Assuming you have authentication set up correctly
            $name = $request->query('name');
            $quan = $request->query('quan');

            $food = Food::query()
                ->where('name', $name)
//                ->where('user_id', $user_id)
                ->update(['quantity' => $quan]);

            return response()->json(['message' => 'Food updated successfully'], 200);
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
//            $user_id = $request->user()->_id; // Assuming you have authentication set up correctly
            $name = $request->query('name');

            $food = Food::query()->where('name', $name)->delete();

            return response()->json(['message' => 'Food Deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
