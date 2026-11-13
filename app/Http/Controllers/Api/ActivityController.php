<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;

class ActivityController extends Controller
{
    public function index()
    {
        $data = Activity::paginate(10);
        return response()->json(['records' => $data]);

    }

    public function store(StoreActivityRequest $request)
    {
        $data = $request->validated();
        $activity = Activity::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $activity,
        ]);
    }

    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        $data = $request->validated();
        $activity->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $activity
        ]);

    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }
}
