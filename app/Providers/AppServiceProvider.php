<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('assign-project', function(User $user, Project $project){
            return $user->projects()->where('project_id', $project->id)->exists()
            ? Response::deny('You are assigned to that project')
            : Response::allow();
        });
    }
}
