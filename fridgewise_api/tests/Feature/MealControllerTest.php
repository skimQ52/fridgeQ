<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class MealControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var User $user */
    protected Model $user;

    protected function setUp(): void
    {
        parent::setUp();

        /** @var User $user */
        $this->user = User::query()->create([
            'name' => 'test',
            'email' => 'test@gmail.com',
            'password' => 'testPassword',
        ]);
    }

    public function test_put_creates_new_meal(): void
    {
        $this->actingAs($this->user)->putJson('/api/meal', [
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
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "message" => "Meal Stored Successfully"
            ]);

        $meal = $this->user->meals()
            ->firstOrFail();
        $this->assertEquals([
            [
                'name' => 'banana',
                'quantity' => 2,
            ],
            [
                'name' => 'onion',
                'quantity' => 2,
            ],
        ], $meal->foods);
    }
}
