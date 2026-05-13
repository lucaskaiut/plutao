<?php

namespace App\Modules\Categories\Domain\Services;

use App\Modules\Categories\Domain\Models\Category;
use Illuminate\Database\Eloquent\Collection;

final class CategoryService
{
    /**
     * @return Collection<int, Category>
     */
    public function list(): Collection
    {
        return Category::query()->orderBy('id')->get();
    }

    public function find(int $id): Category
    {
        return Category::query()->findOrFail($id);
    }

    /**
     * @param  array{name: string, active?: bool}  $data
     */
    public function create(array $data): Category
    {
        if (! array_key_exists('active', $data)) {
            $data['active'] = true;
        }

        return Category::query()->create($data);
    }

    /**
     * @param  array{name?: string, active?: bool}  $data
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        $category->refresh();

        return $category;
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}
