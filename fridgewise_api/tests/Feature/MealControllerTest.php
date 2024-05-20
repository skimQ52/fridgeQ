<?php

namespace Tests\Feature;

use App\Models\Meal;
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

    public function test_a_user_can_delete_their_meal()
    {
        $meal = $this->user->meals()->create(
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
            ]
        );

        $totalCount = $this->user->meals()->count();

        $this->actingAs($this->user)->deleteJson(route('meals.destroy', $meal))
            ->assertOk()
            ->assertJsonFragment([
                "message" => "Meal deleted successfully"
            ]);

        $this->assertEquals($totalCount--, $this->user->meals()->count());
    }

    public function test_cannot_delete_non_existent_meal()
    {
        $meal = Meal::query()->create(
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
                ],
                'user_id' => 'somethingrandom',
            ]
        );

        $totalCount = $this->user->meals()->count();

        $this->actingAs($this->user)->deleteJson(route('meals.destroy', $meal))
            ->assertUnprocessable()
            ->assertJsonFragment([
                "message" => "User does not have this meal"
            ]);

        $this->assertEquals($totalCount, $this->user->meals()->count());
    }


    public function test_get_all_meals() : void {
        $this->user->meals()->createMany(
            [
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
            ],
        );

        $anotherUser = User::factory()->create();
        $anotherUser->meals()->create([
            'foods' => [
                [
                    'name' => 'olives',
                    'quantity' => 10,
                ],
                [
                    'name' => 'strawberry jam',
                    'quantity' => 1,
                ],
            ]
        ]);

        $this->actingAs($this->user)
            ->getJson('/api/meal')
            ->assertOk()
            ->assertJson([
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
            ])
            ->assertJsonMissingExact([
                'foods' => [
                    [
                        'name' => 'olives',
                        'quantity' => 10,
                    ],
                    [
                        'name' => 'strawberry jam',
                        'quantity' => 1,
                    ],
                ]
            ]);
        ;
    }

    public function test_unauthorized_person_cannot_get(): void
    {
        $this->getJson('/api/meal')->assertUnauthorized();
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
