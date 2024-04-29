<?php

namespace Tests\Feature;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class RecipeControllerTest extends TestCase
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

    public function test_put_creates_new_recipe(): void
    {
        $this->actingAs($this->user)->putJson('/api/recipe', [
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

        $recipe = Recipe::query()
            ->where("user_id", $this->user->id)
            ->where("name", "Chiken ALfredo")
            ->firstOrFail();
        $this->assertEquals('its chicken with alfredo', $recipe->description);
        $this->assertEquals('dinner', $recipe->type);
        $this->assertEquals('put chicken with alfredo', $recipe->recipe);
        $this->assertEquals(['chicken', 'alfredo'], $recipe->ingredients);
    }

    public function test_put_rejects_existing_recipe(): void
    {
        Recipe::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->putJson('/api/recipe', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(422)
            ->assertJsonFragment([
                'message' => 'The user already has this recipe.'
            ]);

        $this->assertCount(1, Recipe::query()->get());
    }

    public function test_put_fails_if_fields_are_missing(): void
    {
        $response = $this->actingAs($this->user)->putJson('/api/recipe', []);

        $response->assertStatus(500);

        $this->assertEquals("The name field is required. (and 3 more errors)", $response->json()['error']);
        $this->assertDatabaseCount('recipes', 0);
    }

    public function test_put_name_is_max_25_chars(): void
    {
        $this->actingAs($this->user)->putJson('/api/recipe', [
            "name" => "taco45678910111111111111111111111111111",
            'description' => 'its chicken with alfredo for lunch',
            'type' => 'lunch',
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The name may not be greater than 25 characters."]);

        $this->assertDatabaseCount('recipes', 0);
    }

    public function test_put_type_cant_be_random(): void
    {
        $this->actingAs($this->user)->putJson('/api/recipe', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => "SudoWoodo",
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The selected type is invalid."]);

        $this->assertDatabaseCount('recipes', 0);
    }

    public function test_put_type_must_be_string(): void
    {
        $this->actingAs($this->user)->putJson('/api/recipe', [
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo for lunch',
            "type" => 45,
            'recipe' => 'put chicken with alfredo at lunchtime',
            'ingredients' => ['chicken', 'alfredo', 'carrot'],
            'user_id' => $this->user->id,
        ])
            ->assertStatus(500)
            ->assertJsonFragment(["The type must be a string. (and 1 more error)"]);

        $this->assertDatabaseCount('recipes', 0);
    }

    public function test_delete_destroys_food() {

        Recipe::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        Recipe::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->deleteJson('/api/recipe', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Pesto Salad deleted successfully']);

        $recipes = Recipe::query()->where('user_id', $this->user->id)->get();
        $this->assertCount(1, $recipes);
        $this->assertEquals('Chiken ALfredo', $recipes->first()->name);
    }

    public function test_delete_doesnt_destroy_missing_recipe()
    {

        Recipe::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        Recipe::query()->create([
            "name" => 'Pesto Salad',
            'description' => 'its pesto salad',
            'type' => 'dinner',
            'recipe' => 'put pesto and salad',
            'ingredients' => ['pesto', 'salad'],
            'user_id' => 'someotheruserid',
        ]);

        $this->actingAs($this->user)->deleteJson('/api/recipe', ['name' => 'Pesto Salad'])
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'User does not have the recipe: Pesto Salad']);

        $this->assertCount(2, Recipe::query()->get());
    }

    public function test_get_returns_all_foods(): void
    {
        $recipe1 = Recipe::query()->create([
            "name" => "Chiken ALfredo",
            'description' => 'its chicken with alfredo',
            'type' => 'dinner',
            'recipe' => 'put chicken with alfredo',
            'ingredients' => ['chicken', 'alfredo'],
            'user_id' => $this->user->id,
        ]);

        $recipe2 = Recipe::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

        Recipe::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => 'someotheruserid',
        ]);

        $recipes = Recipe::query()->where('user_id', $this->user->id)->get();
        $this->assertCount(2, $recipes);
        $this->actingAs($this->user)->getJson('/api/recipe')
            ->assertStatus(200)
            ->assertJsonFragment([
                "_id" => $recipe1->id,
                "name" => $recipe1->name,
                "description" => $recipe1->description,
                "type" => $recipe1->type,
                "recipe" => $recipe1->recipe,
                "ingredients" => $recipe1->ingredients,
                'user_id' => $this->user->id,

                "_id" => $recipe2->id,
                "name" => $recipe2->name,
                "description" => $recipe2->description,
                "type" => $recipe2->type,
                "recipe" => $recipe2->recipe,
                'user_id' => $this->user->id,
            ]);
    }

    public function test_get_with_name_returns_the_food(): void
    {
        $taco = Recipe::query()->create([
            "name" => "Pesto Salad",
            'description' => 'its asaladwiuth pesto',
            'type' => 'dinner',
            'recipe' => 'put the salad with the pesto',
            'ingredients' => ['pesto', 'lettuce', 'tomato'],
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user)->getJson('/api/recipe', [
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
