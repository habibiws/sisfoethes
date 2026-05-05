<?php

namespace App\Http\Controllers;

use App\Models\PelatihanParticipation;
use Illuminate\Http\Request;

class PelatihanParticipationController extends Controller
{
    public function index()
    {
        return response()->json(PelatihanParticipation::with('event')->where('user_id', auth()->id())->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pelatihan_event_id' => 'required|exists:pelatihan_events,id',
            'status_keikutsertaan' => 'required|string|in:terdaftar,hadir,tidak_hadir,lulus_sertifikasi',
            'sertifikat_path' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        // Use updateOrCreate to avoid duplicates
        $participation = PelatihanParticipation::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'pelatihan_event_id' => $validated['pelatihan_event_id']
            ],
            $validated
        );

        return response()->json(['message' => 'Partisipasi berhasil disimpan', 'data' => $participation], 200); // 200 instead of 201 as it might be an update
    }

    public function destroy($id)
    {
        // Find by event_id instead of participation id to make frontend logic simpler
        $participation = PelatihanParticipation::where('user_id', auth()->id())
                            ->where('pelatihan_event_id', $id)
                            ->firstOrFail();
                            
        $participation->delete();

        return response()->json(['message' => 'Partisipasi berhasil dibatalkan']);
    }
}
