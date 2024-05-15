<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\User;
use Illuminate\Http\Request;

class MealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'meals' => [
                [
                    'foods' => [
                        [
                            'name' => 'banana',
                            'quantity' => 2,
                        ],
                        [
                            'name' => 'onion',
                            'quantity' => 2,
                        ],
                    ]
                ],
                [
                    'foods' => [
                        [
                            'name' => 'egg',
                            'quantity' => 4,
                        ],
                        [
                            'name' => 'bacon',
                            'quantity' => 7,
                        ],
                        [
                            'name' => 'bread',
                            'quantity' => 1,
                        ],
                    ]
                ],
            ]
        ]);
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
    public function destroy(Meal $meal)
    {
        //
    }
}
