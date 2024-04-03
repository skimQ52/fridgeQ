<?php


// use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Food;
use Tests\TestCase;

class MealControllerTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_post_creates_new_meal(): void
    {
        $response = $this->post('/api/meal', [
            "name" => "taco",
            "type" => "fruit",
            "quantity" => "29",
        ]);

        $response->assertStatus(200);

        $food = Food::query()->where("name", "taco")->firstOrFail();

        $this->assertEquals('fruit', $food->type);
        $this->assertEquals(29, $food->quantity);
    }

//    public function test_post_fails_if_fields_are_missing(): void
//    {
//        //TODO: this test sux
//        $response = $this->post('/api/food', []);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The name field is required. (and 1 more error)", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
//
//    public function test_post_name_is_max_25_chars(): void
//    {
//        $response = $this->post('/api/food', [
//            "name" => "taco45678910111111111111111111111111111",
//            "type" => "fruit",
//            "quantity" => "99",
//        ]);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The name may not be greater than 25 characters.", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
//
//    public function test_post_quantity_cant_be_over_99(): void
//    {
//        $response = $this->post('/api/food', [
//            "name" => "taco",
//            "type" => "fruit",
//            "quantity" => "100",
//        ]);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The quantity must be between 1 and 99.", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
//
//    public function test_post_quantity_cant_be_negative(): void
//    {
//        $response = $this->post('/api/food', [
//            "name" => "taco",
//            "type" => "fruit",
//            "quantity" => "-1",
//        ]);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The quantity must be between 1 and 99.", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
//
//    public function test_post_quantity_cant_be_string(): void
//    {
//        $response = $this->post('/api/food', [
//            "name" => "taco",
//            "type" => "fruit",
//            "quantity" => "SudoWoodo",
//        ]);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The quantity must be a number.", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
//
//    public function test_post_type_cant_be_random(): void
//    {
//        $response = $this->post('/api/food', [
//            "name" => "taco",
//            "type" => "SudoWoodo",
//            "quantity" => "5",
//        ]);
//
//        $response->assertStatus(500);
//
//        $this->assertEquals("The selected type is invalid.", $response->json()['error']);
//
//        $this->assertDatabaseCount('foods', 0);
//    }
}
