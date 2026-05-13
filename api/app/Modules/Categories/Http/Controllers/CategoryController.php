<?php

namespace App\Modules\Categories\Http\Controllers;

use App\Modules\Categories\Domain\Services\CategoryService;
use App\Modules\Categories\Http\Requests\CategoryStoreRequest;
use App\Modules\Categories\Http\Requests\CategoryUpdateRequest;
use App\Modules\Categories\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

final class CategoryController
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function index(): JsonResponse
    {
        return CategoryResource::collection($this->categoryService->list())->response();
    }

    public function store(CategoryStoreRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $category): JsonResponse
    {
        return (new CategoryResource($this->categoryService->find($category)))->response();
    }

    public function update(CategoryUpdateRequest $request, int $category): JsonResponse
    {
        $model = $this->categoryService->find($category);
        $model = $this->categoryService->update($model, $request->validated());

        return (new CategoryResource($model))->response();
    }

    public function destroy(int $category): Response
    {
        $this->categoryService->delete($this->categoryService->find($category));

        return response()->noContent();
    }
}
