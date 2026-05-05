<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Publikasi;
use App\Models\Hibah;
use App\Models\Paten;
use App\Models\Abdimas;
use App\Models\PelatihanParticipation;

class CapaianSummaryController extends Controller
{
    public function getSummary()
    {
        $userId = auth()->id();
        return response()->json([
            'publikasi' => Publikasi::where('user_id', $userId)->count(),
            'hibah' => Hibah::where('user_id', $userId)->count(),
            'paten' => Paten::where('user_id', $userId)->count(),
            'abdimas' => Abdimas::where('user_id', $userId)->count(),
            'pelatihan' => PelatihanParticipation::where('user_id', $userId)->count(),
        ]);
    }
}
