<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $user= Auth::user();

        if($user->role == 'admin'){
            return response()->json(['records' => ProjectResource::collection(Project::paginate(10))]);
        }
        $data = Project::paginate(10);

        $projects = Project::withCount(['users as is_assigned' => function($query) use($user){
            $query->where('users.id' ,$user->id);
        }])->paginate(10);
 
        $projects->getCollection()->transform(function($project){
            $project->is_assigned = (bool) $project->is_assigned;
            return $project;
        });

        return response()->json(['records' => $projects]);
    }

    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $project = Project::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $project->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $project
        ]);

    }
    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }

    public function assign(Project $project)
    {
        $this->authorize('assign-project', $project);
        $user = Auth::user();
        $user->projects()->attach($project->id);

        return response()->json(['message' => 'Project has been assigned to you!']);

    }
}

/*
"SQLSTATE[42S22]: Column not found: 1054 Unknown column 
'projects.id' in 'where clause' (Connection: mysql, Host: 127.0.0.1, Port: 3306,
 Database: react_laravel_first_app, SQL: 
 select count(*) from `users` inner join `project_user` 
 on `users`.`id` = `project_user`.`user_id` 
 where `projects`.`id` = `project_user`.`project_id` and `users`.`id` = 2)"

*/