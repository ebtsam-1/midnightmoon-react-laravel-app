<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $data = Product::with(['category', 'primaryImage'])->paginate(10);
        return response()->json(['records' => ProductResource::collection($data)->resource]);

    }

    public function categories()
    {
        return response()->json(['records' => Category::all()]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        return $data;
        $product = Product::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $product->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $product
        ]);

    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }
}
