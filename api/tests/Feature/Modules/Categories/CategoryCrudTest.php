<?php

namespace Tests\Feature\Modules\Categories;

use App\Modules\Categories\Domain\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use RefreshDatabase;

    private function categoriesUrl(): string
    {
        return '/api/categories';
    }

    private function categoryUrl(int $id): string
    {
        return '/api/categories/'.$id;
    }

    private function authenticateUser(): User
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        return $user;
    }

    public function test_index_returns_empty_list_when_no_categories(): void
    {
        $this->authenticateUser();

        $response = $this->getJson($this->categoriesUrl());

        $response->assertOk()
            ->assertJsonPath('data', []);
    }

    public function test_index_returns_categories_ordered_by_id(): void
    {
        $this->authenticateUser();

        $first = Category::factory()->create(['name' => 'First', 'active' => false]);
        $second = Category::factory()->create(['name' => 'Second', 'active' => true]);

        $response = $this->getJson($this->categoriesUrl());

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $first->id)
            ->assertJsonPath('data.0.name', 'First')
            ->assertJsonPath('data.0.active', false)
            ->assertJsonPath('data.1.id', $second->id)
            ->assertJsonPath('data.1.name', 'Second')
            ->assertJsonPath('data.1.active', true);

        $createdAt0 = $response->json('data.0.created_at');
        $updatedAt0 = $response->json('data.0.updated_at');
        $this->assertIsString($createdAt0);
        $this->assertIsString($updatedAt0);
    }

    public function test_store_validation_fails_when_name_is_missing(): void
    {
        $this->authenticateUser();

        $response = $this->postJson($this->categoriesUrl(), [
            'active' => true,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_validation_fails_when_active_is_not_boolean(): void
    {
        $this->authenticateUser();

        $response = $this->postJson($this->categoriesUrl(), [
            'name' => 'Books',
            'active' => 'not-a-boolean',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['active']);
    }

    public function test_store_creates_category_and_returns_201(): void
    {
        $this->authenticateUser();

        $response = $this->postJson($this->categoriesUrl(), [
            'name' => 'Electronics',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Electronics')
            ->assertJsonPath('data.active', true);

        $id = $response->json('data.id');
        $this->assertIsInt($id);

        $this->assertDatabaseHas('categories', [
            'id' => $id,
            'name' => 'Electronics',
            'active' => true,
        ]);
    }

    public function test_store_accepts_explicit_active_false(): void
    {
        $this->authenticateUser();

        $response = $this->postJson($this->categoriesUrl(), [
            'name' => 'Archived',
            'active' => false,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.active', false);

        $this->assertDatabaseHas('categories', [
            'name' => 'Archived',
            'active' => false,
        ]);
    }

    public function test_show_returns_category(): void
    {
        $this->authenticateUser();

        $category = Category::factory()->create([
            'name' => 'Show Me',
            'active' => true,
        ]);

        $response = $this->getJson($this->categoryUrl($category->id));

        $response->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Show Me')
            ->assertJsonPath('data.active', true);
    }

    public function test_show_returns_404_when_category_missing(): void
    {
        $this->authenticateUser();

        $response = $this->getJson($this->categoryUrl(999_999));

        $response->assertNotFound();
    }

    public function test_update_validation_fails_when_name_is_empty_string(): void
    {
        $this->authenticateUser();

        $category = Category::factory()->create();

        $response = $this->putJson($this->categoryUrl($category->id), [
            'name' => '',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_update_validation_fails_when_active_is_invalid(): void
    {
        $this->authenticateUser();

        $category = Category::factory()->create();

        $response = $this->putJson($this->categoryUrl($category->id), [
            'name' => 'Valid',
            'active' => 'nope',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['active']);
    }

    public function test_update_updates_category(): void
    {
        $this->authenticateUser();

        $category = Category::factory()->create([
            'name' => 'Old',
            'active' => true,
        ]);

        $response = $this->putJson($this->categoryUrl($category->id), [
            'name' => 'New',
            'active' => false,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'New')
            ->assertJsonPath('data.active', false);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New',
            'active' => false,
        ]);
    }

    public function test_destroy_returns_no_content_and_removes_category(): void
    {
        $this->authenticateUser();

        $category = Category::factory()->create();

        $response = $this->deleteJson($this->categoryUrl($category->id));

        $response->assertNoContent();

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_destroy_returns_404_when_category_missing(): void
    {
        $this->authenticateUser();

        $response = $this->deleteJson($this->categoryUrl(999_999));

        $response->assertNotFound();
    }

    public function test_unauthenticated_requests_return_401(): void
    {
        $category = Category::factory()->create();

        $this->getJson($this->categoriesUrl())->assertUnauthorized();
        $this->postJson($this->categoriesUrl(), ['name' => 'X'])->assertUnauthorized();
        $this->getJson($this->categoryUrl($category->id))->assertUnauthorized();
        $this->putJson($this->categoryUrl($category->id), ['name' => 'Y'])->assertUnauthorized();
        $this->deleteJson($this->categoryUrl($category->id))->assertUnauthorized();
    }
}
