<?php

namespace Tests\Feature;

use Carbon\Carbon;
use App\Models\Food;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;


class FoodControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_put_creates_new_food(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => "fruit",
            "quantity" => "29",
        ]);

        $response->assertStatus(200);

        $food = Food::query()->where("name", "taco")->firstOrFail();

        $this->assertEquals('fruit', $food->type);
        $this->assertEquals(29, $food->quantity);
    }

    public function test_put_fails_if_fields_are_missing(): void
    {
        //TODO: this test sux
        $response = $this->put('/api/food', []);

        $response->assertStatus(500);

        $this->assertEquals("The name field is required. (and 1 more error)", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_name_is_max_25_chars(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco45678910111111111111111111111111111",
            "type" => "fruit",
            "quantity" => "99",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The name may not be greater than 25 characters.", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_over_99(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => "fruit",
            "quantity" => "100",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The quantity must be between 1 and 99.", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_negative(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => "fruit",
            "quantity" => "-1",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The quantity must be between 1 and 99.", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_string(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => "fruit",
            "quantity" => "SudoWoodo",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The quantity must be a number.", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_type_cant_be_random(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => "SudoWoodo",
            "quantity" => "5",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The selected type is invalid.", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_type_must_be_string(): void
    {
        $response = $this->put('/api/food', [
            "name" => "taco",
            "type" => 48,
            "quantity" => "5",
        ]);

        $response->assertStatus(500);

        $this->assertEquals("The type must be a string. (and 1 more error)", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_delete_destroys_food() {

        Food::query()->create([
            'name' => 'bread',
            'type' => 'grain',
            'quantity' => 3,
        ]);

        Food::query()->create([
            'name' => 'orange',
            'type' => 'fruit',
            'quantity' => 7,
        ]);

        $response = $this->delete('/api/food', ['name' => 'orange']);

        $response->assertStatus(200)->assertJson(['message' => 'orange deleted successfully']);

        $this->assertCount(1, Food::query()->get());
    }

    public function test_delete_doesnt_destroy_missing_food() {

        Food::query()->create([
            'name' => 'orange',
            'type' => 'fruit',
            'quantity' => 7,
        ]);

        $response = $this->delete('/api/food', ['name' => 'bread']);

        $response->assertStatus(200)->assertJson(['message' => 'User does not have the food: bread']);

        $this->assertCount(1, Food::query()->get());
    }

    public function test_patch_updates_food() {
        $bread = Food::query()->create([
            'name' => 'bread',
            'type' => 'grain',
            'quantity' => 3,
        ]);

        $response = $this->patch('/api/food', ['name' => 'bread', 'quan' => 16]);

        $bread = $bread->fresh();
        $this->assertEquals(16, $bread->quantity);

        $response->assertStatus(200)->assertJson(['message' => 'bread updated successfully']);
    }

    public function test_patch_doesnt_update_missing_food() {

        $response = $this->patch('/api/food', ['name' => 'bread', 'quan' => 16]);

        $response->assertStatus(200)->assertJson(['message' => 'User does not have the food: bread']);
    }

    public function test_get_returns_all_foods(): void
    {
        $bread = Food::query()->create([
            'name' => 'bread',
            'type' => 'grain',
            'quantity' => 2,
        ]);

        $banana = Food::query()->create([
            'name' => 'banana',
            'type' => 'fruit',
            'quantity' => 7,
        ]);

        $foods = Food::query()->get();
        $this->assertCount(2, $foods);
        $response = $this->get('/api/food');

        $response->assertStatus(200);
        $this->assertArraySubset([
            "_id" => $bread->id,
            "name" => $bread->name,
            "type" => $bread->type,
            "quantity" => $bread->quantity,
        ], $response->json('data')[0]);

        $this->assertArraySubset([
            "_id" => $banana->id,
            "name" => $banana->name,
            "type" => $banana->type,
            "quantity" => $banana->quantity,
        ], $response->json('data')[1]);
    }

    public function test_get_with_name_returns_the_food(): void
    {
        $taco = Food::query()->create([
            'name' => 'taco',
            'type' => 'fruit',
            'quantity' => 7,
        ]);

        $response = $this->get('/api/food', [
            "name" => "taco",
        ]);

        $response->assertStatus(200);
        $this->assertArraySubset([
            "_id" => $taco->id,
            "name" => $taco->name,
            "type" => $taco->type,
            "quantity" => $taco->quantity,
        ], $response->json('data')[0]);
    }
}
