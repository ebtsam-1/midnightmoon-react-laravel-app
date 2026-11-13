<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request)
    {
        $data = $request->validated();
        if(isset($data['avatar'])){
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }
        $user = User::create($data);
        $token = $user->createToken('main')->plainTextToken;
        $user->assignRole('user');

        return response()->json([
            'token' => $token,
            'user' => UserResource::make($user),
            'message' => 'Logged in successfully'
        ]);
    }

    public function login(LoginUserRequest $request)
    {
        $data = $request->validated();

        if(! Auth::attempt(['email' => $data['email'], 'password'=> $data['password']])) {
            return response()->json(['message' => "invalid credentials"], 401);
        }

        $user = User::where('email', $data['email'])->first();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => UserResource::make($user),
            'role' => $user->getRoleNames()[0],
            'message' => 'Logged in successfully'
        ]);
    }

    public function logout()
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully!']);
    }

    public function myInfo()
    {
        return response()->json([
            'my_info' => UserResource::make(Auth::user())
        ]);
    }
}
