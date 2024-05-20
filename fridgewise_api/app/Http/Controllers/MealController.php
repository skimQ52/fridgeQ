<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var User $user */
        $user = auth()->user();
        return response()->json(["meals" => $user->meals()->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();
        $user->meals()->create([
            'foods' => $request->foods
        ]);

        return response()->json([
            'message' => 'Meal Stored Successfully',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function destroy(Meal $meal): JsonResponse
    {
        $userHasTheMeal = auth()->user()->meals()->where('id', $meal->id)->first();
        if (!$userHasTheMeal) {
            return response()->json([
                'message' => "User does not have this meal",
            ], 422);
        }
        $meal->delete();
        return response()->json([
            'message' => "Meal deleted successfully",
        ]);
    }
}
