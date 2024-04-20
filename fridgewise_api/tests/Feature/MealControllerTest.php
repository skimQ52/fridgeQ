<?php

namespace Tests\Feature;

use App\Models\Meal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;


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

    public function test_put_creates_new_food(): void
    {
        $this->actingAs($this->user)->putJson('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "name" => "Chiken ALfredo",
                'description' => 'its chicken with alfredo',
                'type' => 'dinner',
                'recipe' => 'put chicken with alfredo',
                'ingredients' => ['chicken', 'alfredo'],
                'user_id' => $this->user->id,
            ]);

        $meal = Meal::query()
            ->where("user_id", $this->user->id)
            ->where("name", "Chiken ALfredo")
            ->firstOrFail();
        $this->assertEquals('its chicken with alfredo', $meal->description);
        $this->assertEquals('dinner', $meal->type);
        $this->assertEquals('put chicken with alfredo', $meal->recipe);
        $this->assertEquals(['chicken', 'alfredo'], $meal->ingredients);
    }

    public function test_put_rejects_existing_meal(): void
    {
        Meal::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->putJson('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'The user already has this meal.'
            ]);

        $this->assertCount(1, Meal::query()->get());
    }

    public function test_put_fails_if_fields_are_missing(): void
    {
        $response = $this->actingAs($this->user)->putJson('/api/meal', []);

        $response->assertStatus(500);

        $this->assertEquals("The name field is required. (and 3 more errors)", $response->json()['error']);
        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_name_is_max_25_chars(): void
    {
        $this->actingAs($this->user)->putJson('/api/meal', [
            "name" => "taco45678910111111111111111111111111111",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The name may not be greater than 25 characters."]);

        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_type_cant_be_random(): void
    {
        $this->actingAs($this->user)->putJson('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => "SudoWoodo",
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The selected type is invalid."]);

        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_type_must_be_string(): void
    {
        $this->actingAs($this->user)->putJson('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => 45,
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The type must be a string. (and 1 more error)"]);

        $this->assertDatabaseCount('meals', 0);
    }

    public function test_delete_destroys_food() {

        Meal::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        Meal::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->deleteJson('/api/meal', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Pesto Salad deleted successfully']);

        $meals = Meal::query()->where('user_id', $this->user->id)->get();
        $this->assertCount(1, $meals);
        $this->assertEquals('Chiken ALfredo', $meals->first()->name);
    }

    public function test_delete_doesnt_destroy_missing_meal() {

        Meal::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        Meal::query()->create([
            "name" => 'Pesto Salad',
            'description' => 'its pesto salad',
            'type' => 'dinner',
            'recipe' => 'put pesto and salad',
            'ingredients' => ['pesto', 'salad'],
            'user_id' => 'someotheruserid',
        ]);

        $this->actingAs($this->user)->deleteJson('/api/meal', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'User does not have the meal: Pesto Salad']);

        $this->assertCount(2, Meal::query()->get());
    }

    public function test_get_returns_all_foods(): void
    {
        $meal1 = Meal::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        $meal2 = Meal::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

         Meal::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => 'someotheruserid',
        ]);

        $meals = Meal::query()->where('user_id', $this->user->id)->get();
        $this->assertCount(2, $meals);
        $this->actingAs($this->user)->getJson('/api/meal')
            ->assertStatus(200)
            ->assertJsonFragment([
                "_id" => $meal1->id,
                "name" => $meal1->name,
                "description" => $meal1->description,
                "type" => $meal1->type,
                "recipe" => $meal1->recipe,
                "ingredients" => $meal1->ingredients,
                'user_id' => $this->user->id,

                "_id" => $meal2->id,
                "name" => $meal2->name,
                "description" => $meal2->description,
                "type" => $meal2->type,
                "recipe" => $meal2->recipe,
                'user_id' => $this->user->id,
            ]);
    }

    public function test_get_with_name_returns_the_food(): void
    {
        $taco = Meal::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->getJson('/api/meal', [
            "name" => "Pesto Salad",
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "_id" => $taco->id,
                "name" => $taco->name,
                "description" => $taco->description,
                "type" => $taco->type,
                "recipe" => $taco->recipe,
                "ingredients" => $taco->ingredients,
                'user_id' => $this->user->id,
            ]);
    }
}
