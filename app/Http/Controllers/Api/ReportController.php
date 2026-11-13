<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Project;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        $records = Report::with('project')->paginate(10);
        return response()->json(['records' => ReportResource::collection($records)->resource]);
    }

    public function store(StoreReportRequest $request)
    {
        $data = $request->validated();
        $report = Report::create($data);
        return response()->json([
            'message' => 'Creation process is done successfully!',
            'record' => $report,
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report)
    {
        $data = $request->validated();
        $report->update($data);
        return response()->json([
            'message' => 'Updating process is done successfully!',
            'record' => $report
        ]);

    }

    public function destroy(Report $report)
    {
        $report->delete();
        return response()->json(['message' => 'Deleting process is done successfully!']);
    }

    public function indexByProject(Project $project)
    {
        $records = $project->reports()->with('project')->paginate(10);
        return response()->json(['records' => ReportResource::collection($records)->resource]);
    }
}

