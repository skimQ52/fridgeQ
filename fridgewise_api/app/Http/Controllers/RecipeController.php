<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();
        try {
            $recipeName = $request->query('name');

            if ($recipeName) {
                $recipe = $user->recipes()->where('name', $recipeName)->first();
                return response()->json(['data' => $recipe]);
            }
            $recipes = $user->recipes()->get();
            return response()->json(['data' => $recipes]);
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
                'name' => 'string|required|max:50',
                'description' => 'string|required|max:250',
                'recipe' => 'string|required|max:1250',
                'ingredients' => 'array|required',
                'type' => 'string|in:Breakfast,Lunch,Dinner,Snack,Dessert'
            ]);

            /** @var User $user */
            $user = auth()->user();

            $recipe = $user->recipes()
                ->where('name', $validated['name'])
                ->first();
            if ($recipe) {
                return response()->json(['message' => 'The user already has this recipe.'], 422);
            }

            $recipe = $user->recipes()->create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'type' => $validated['type'],
                'recipe' => $validated['recipe'],
                'ingredients' => $validated['ingredients'],
            ]);
            return response()->json((['data' => $recipe]));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipe $recipe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipe $recipe)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth()->user();
            $name = $request->input("name");
            $recipe = $user->recipes()
                ->where('name', $name)
                ->first();
            if (!$recipe) {
                return response()->json(['message' => 'User does not have the recipe: ' . $name]);
            }
            $recipe->delete();
            return response()->json(['message' => $name.' deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
