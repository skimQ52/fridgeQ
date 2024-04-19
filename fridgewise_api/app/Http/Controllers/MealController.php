<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $mealName = $request->query('name');

            if ($mealName) {
                $meal = Meal::query()->where('name', $mealName)->first(); // todo: where user_id
                return response()->json(['data' => $meal]);
            }
            $meals = Meal::query()->get(); // todo: where user_id
            return response()->json(['data' => $meals]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'string|required|max:25',
                'description' => 'string|required|max:250',
                'recipe' => 'string|required|max:1250',
                'ingredients' => 'array|required',
                'type' => 'string|in:breakfast,lunch,dinner,snack,dessert'
            ], [
                'name.required' => 'The name field is required.',
                'name.string' => 'The name must be a string.',
                'name.max' => 'The name may not be greater than 25 characters.',
                'description.required' => 'The description field is required.',
                'description.string' => 'The description must be a string.',
                'description.max' => 'The name may not be greater than 250 characters.',
                'recipe.required' => 'The recipe field is required.',
                'recipe.string' => 'The recipe must be a string.',
                'recipe.max' => 'The recipe may not be greater than 1250 characters.',
                'type.required' => 'The type field is required.',
                'type.string' => 'The type must be a string.',
                'type.in' => 'The selected type is invalid.',
                'ingredients.required' => 'The ingredients field is required.',
            ]);

            $meal = Meal::query()->where('name', $validated['name'])->first();
            if ($meal) {
                return response()->json(['message' => 'The user already has this meal.'], 422);
            }

            $meal = Meal::query()->create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'recipe' => $validated['recipe'],
                'ingredients' => $validated['ingredients'],
                'user_id' => "TEMPUSERID1231412312412312", //todo: Fix user id to real
            ]);
            return response()->json((['data' => $meal]));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Meal $meal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Meal $meal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Meal $meal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
//            $user_id = $request->user()->_id;
            $name = $request->input("name");
            $meal = Meal::query()
                ->where('name', $name)
//                ->where('user_id', $user_id)
                ->first();
            if (!$meal) {
                return response()->json(['message' => 'User does not have the meal: '. $name]);
            }
            $meal->delete();
            return response()->json(['message' => $name.' deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
