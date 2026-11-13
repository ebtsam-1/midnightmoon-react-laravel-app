<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeatureRequest;
use App\Http\Requests\UpdateFeatureRequest;
use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    public function index()
    {
        $data = Feature::paginate(10);
        return response()->json(['records' => $data]);
    }

    public function store(StoreFeatureRequest $request)
    {
        $data = $request->validated();
        $data['img'] = $request->file('img')->store('features', 'public');
        $feature = Feature::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $feature,
        ]);
    }
    public function update(UpdateFeatureRequest $request, Feature $feature)
    {
        $data = $request->validated();
        $feature->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $feature
        ]);

    }
    public function destroy(Feature $feature)
    {
        $feature->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }
}
