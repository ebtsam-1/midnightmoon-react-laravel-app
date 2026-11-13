<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $data = User::paginate(10);
        return response()->json(['records' => UserResource::collection($data)->resource]);

    }

    public function store(RegisterUserRequest $request)
    {
        $data = $request->validated();
        $user = User::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $user
        ]);

    }

    public function destroy(User $user)
    {
        // $user->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }


}
