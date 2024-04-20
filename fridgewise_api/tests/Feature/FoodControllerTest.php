<?php

namespace Tests\Feature;

use App\Http\Middleware\Authenticate;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Food;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;


class FoodControllerTest extends TestCase
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
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "fruits",
            "quantity" => 29,
        ])
            ->assertStatus(200)
            ->assertJsonFragment([ // put data
                "name" => "taco",
                "type" => "fruits",
                "quantity" => 29
        ]);

        $food = Food::query()
            ->where("name", "taco")
            ->where('user_id', $this->user->id)
            ->firstOrFail();
        $this->assertEquals('fruits', $food->type);
        $this->assertEquals(29, $food->quantity);
    }

    public function test_put_updates_existing_food_quantity(): void
    {
        $food = Food::query()->create([
            'name' => 'taco',
            'type' => 'fruits',
            'quantity' => 3,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "grains",
            "quantity" => 29,
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "name" => "taco",
                "type" => "fruits",
                "quantity" => 29
        ]);

        $food->refresh();
        $this->assertEquals('taco', $food->name);
        $this->assertEquals('fruits', $food->type);
        $this->assertEquals(29, $food->quantity);
    }

    public function test_put_fails_if_fields_are_missing(): void
    {
        $response = $this->actingAs($this->user)->putJson('/api/food', []);

        $response->assertStatus(500);

        $this->assertEquals("The name field is required. (and 1 more error)", $response->json()['error']);
        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_name_is_max_25_chars(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco45678910111111111111111111111111111",
            "type" => "fruits",
            "quantity" => "99",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The name may not be greater than 25 characters."]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_over_99(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "fruits",
            "quantity" => "100",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The quantity must be between 1 and 99."]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_negative(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "fruits",
            "quantity" => "-1",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The quantity must be between 1 and 99."]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_quantity_cant_be_string(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "fruits",
            "quantity" => "SudoWoodo",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The quantity must be a number."]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_type_cant_be_random(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => "SudoWoodo",
            "quantity" => "5",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The selected type is invalid."]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_put_type_must_be_string(): void
    {
        $this->actingAs($this->user)->putJson('/api/food', [
            "name" => "taco",
            "type" => 48,
            "quantity" => "5",
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The type must be a string. (and 1 more error)"]);

        $this->assertDatabaseCount('foods', 0);
    }

    public function test_delete_destroys_food() {

        Food::query()->create([
            'name' => 'bread',
            'type' => 'grains',
            'quantity' => 3,
            'user_id' => $this->user->id,
        ]);

        Food::query()->create([
            'name' => 'orange',
            'type' => 'fruits',
            'quantity' => 7,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->deleteJson('/api/food', ['name' => 'orange'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'orange deleted successfully']);

        $this->assertCount(1, Food::query()->get());
        $this->assertEquals('bread', Food::query()->first()->name);
    }

    public function test_delete_doesnt_destroy_missing_food() {

        Food::query()->create([
            'name' => 'orange',
            'type' => 'fruits',
            'quantity' => 7,
            'user_id' => $this->user->id,
        ]);

        Food::query()->create([
            'name' => 'bread',
            'type' => 'grains',
            'quantity' => 7,
            'user_id' => 'SOMEOTHERUSERID',
        ]);

        $this->actingAs($this->user)->deleteJson('/api/food', ['name' => 'bread'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'User does not have the food: bread']);

        $this->assertCount(2, Food::query()->get());
    }

    public function test_patch_updates_food() {

        $bread = Food::query()->create([
            'name' => 'bread',
            'type' => 'grains',
            'quantity' => 3,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->patchJson('/api/food', ['name' => 'bread', 'quan' => 16])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'bread updated successfully']);

        $bread = $bread->fresh();
        $this->assertEquals(16, $bread->quantity);
    }

    public function test_patch_doesnt_update_missing_food() {
        Food::query()->create([
            'name' => 'bread',
            'type' => 'grains',
            'quantity' => 7,
            'user_id' => 'SOMEOTHERUSERID',
        ]);

        $this->actingAs($this->user)->patchJson('/api/food', ['name' => 'bread', 'quan' => 16])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'User does not have the food: bread']);
    }

    public function test_get_returns_all_foods(): void
    {
        $bread = Food::query()->create([
            'name' => 'bread',
            'type' => 'grains',
            'quantity' => 2,
            'user_id' => $this->user->id,
        ]);

        $banana = Food::query()->create([
            'name' => 'banana',
            'type' => 'fruits',
            'quantity' => 7,
            'user_id' => $this->user->id,
        ]);

         Food::query()->create([
            'name' => 'banana',
            'type' => 'fruits',
            'quantity' => 7,
            'user_id' => 'SOMEOTHERUSERID',
        ]);

        $foods = Food::query()->where('user_id', $this->user->id)->get();
        $this->assertCount(2, $foods);
        $this->actingAs($this->user)->getJson('/api/food')
            ->assertStatus(200)
            ->assertJsonFragment([
                "_id" => $bread->id,
                "name" => $bread->name,
                "type" => $bread->type,
                "quantity" => $bread->quantity,
                'user_id' => $bread->user_id,

                "_id" => $banana->id,
                "name" => $banana->name,
                "type" => $banana->type,
                "quantity" => $banana->quantity,
                'user_id' => $banana->user_id,
            ]);
    }

    public function test_get_with_name_returns_the_food(): void
    {
        $taco = Food::query()->create([
            'name' => 'taco',
            'type' => 'fruits',
            'quantity' => 7,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->getJson('/api/food', [
            "name" => "taco",
        ])
            ->assertStatus(200)
            ->assertJsonFragment([
                "_id" => $taco->id,
                "name" => $taco->name,
                "type" => $taco->type,
                "quantity" => $taco->quantity,
                "user_id" => $this->user->id,
            ]);
    }
}
