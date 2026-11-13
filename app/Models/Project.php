<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    //Relations
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
