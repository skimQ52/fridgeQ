<?php

namespace Tests\Feature;

use App\Models\Meal;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;


class MealControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_put_creates_new_food(): void
    {
        $this->putJson('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "name" => "Chiken ALfredo",
                'description' => 'its chicken with alfredo',
                'type' => 'dinner',
                'recipe' => 'put chicken with alfredo',
                'ingredients' => ['chicken', 'alfredo'],
            ]);

        $meal = Meal::query()->where("name", "Chiken ALfredo")->firstOrFail();
        $this->assertEquals('its chicken with alfredo', $meal->description);
        $this->assertEquals('dinner', $meal->type);
        $this->assertEquals('put chicken with alfredo', $meal->recipe);
        $this->assertEquals(['chicken', 'alfredo'], $meal->ingredients);
    }

    public function test_put_rejects_existing_meal(): void
    {
        Meal::query()->create([ //use factory
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
        ]);

        $this->put('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
        ])
            ->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'The user already has this meal.'
            ]);

        $this->assertCount(1, Meal::query()->where("name", "Chiken ALfredo")->get());
    }

    public function test_put_fails_if_fields_are_missing(): void
    {
        $response = $this->put('/api/meal', []);

        $response->assertStatus(500);

        $this->assertEquals("The name field is required. (and 3 more errors)", $response->json()['error']);
        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_name_is_max_25_chars(): void
    {
        $this->put('/api/meal', [
            "name" => "taco45678910111111111111111111111111111",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The name may not be greater than 25 characters."]);

        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_type_cant_be_random(): void
    {
        $this->put('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => "SudoWoodo",
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The selected type is invalid."]);

        $this->assertDatabaseCount('meals', 0);
    }

    public function test_put_type_must_be_string(): void
    {
        $this->put('/api/meal', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => 45,
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
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
        ]);

        Meal::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
        ]);

        $this->delete('/api/meal', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Pesto Salad deleted successfully']);

        $this->assertCount(1, Meal::query()->get());
        $this->assertEquals('Chiken ALfredo', Meal::query()->first()->name);
    }

    public function test_delete_doesnt_destroy_missing_meal() {

        Meal::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
        ]);

        $this->delete('/api/meal', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'User does not have the meal: Pesto Salad']);

        $this->assertCount(1, Meal::query()->get());
    }
//
//    public function test_patch_updates_food() {
//
//        $bread = Food::query()->create([
//            'name' => 'bread',
//            'type' => 'grain',
//            'quantity' => 3,
//        ]);
//
//        $this->patch('/api/food', ['name' => 'bread', 'quan' => 16])
//            ->assertStatus(200)
//            ->assertJsonFragment(['message' => 'bread updated successfully']);
//
//        $bread = $bread->fresh();
//        $this->assertEquals(16, $bread->quantity);
//    }
//
//    public function test_patch_doesnt_update_missing_food() {
//        $this->patch('/api/food', ['name' => 'bread', 'quan' => 16])
//            ->assertStatus(200)
//            ->assertJsonFragment(['message' => 'User does not have the food: bread']);
//    }
//
//    public function test_get_returns_all_foods(): void
//    {
//        $bread = Food::query()->create([
//            'name' => 'bread',
//            'type' => 'grain',
//            'quantity' => 2,
//        ]);
//
//        $banana = Food::query()->create([
//            'name' => 'banana',
//            'type' => 'fruit',
//            'quantity' => 7,
//        ]);
//
//        $foods = Food::query()->get();
//        $this->assertCount(2, $foods);
//        $this->get('/api/food')
//            ->assertStatus(200)
//            ->assertJsonFragment([
//                "_id" => $bread->id,
//                "name" => $bread->name,
//                "type" => $bread->type,
//                "quantity" => $bread->quantity,
//
//                "_id" => $banana->id,
//                "name" => $banana->name,
//                "type" => $banana->type,
//                "quantity" => $banana->quantity,
//            ]);
//    }
//
//    public function test_get_with_name_returns_the_food(): void
//    {
//        $taco = Food::query()->create([
//            'name' => 'taco',
//            'type' => 'fruit',
//            'quantity' => 7,
//        ]);
//
//        $this->get('/api/food', [
//            "name" => "taco",
//        ])
//            ->assertStatus(200)
//            ->assertJsonFragment([
//                "_id" => $taco->id,
//                "name" => $taco->name,
//                "type" => $taco->type,
//                "quantity" => $taco->quantity,
//            ]);
//    }
}
