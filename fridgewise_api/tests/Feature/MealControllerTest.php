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

        //create another user and a food for that random user (to assert it doesnt also get returned)
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

        // ensure there is an endpoint
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
        ;


        // assert response is identical with user's current meals
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
