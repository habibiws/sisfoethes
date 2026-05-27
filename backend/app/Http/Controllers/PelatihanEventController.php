<?php

namespace App\Http\Controllers;

use App\Models\PelatihanEvent;
use Illuminate\Http\Request;

class PelatihanEventController extends Controller
{
    public function index()
    {
        // All users can see all events
        return response()->json(PelatihanEvent::with('creator')->withCount('participations')->orderBy('tanggal_mulai', 'desc')->get());
    }

    public function store(Request $request)
    {
        // Only sub_kk, ketua_kk, admin can create
        if (!in_array(auth()->user()->role, ['ketua_sub_kk', 'ketua_kk', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'judul' => 'required|string',
            'penyelenggara' => 'required|string',
            'jenis' => 'required|string|in:workshop,sertifikasi,pelatihan,webinar,seminar',
            'topik' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date',
            'triwulan' => 'required|integer|between:1,4',
            'tahun' => 'required|integer',
            'estimasi_biaya' => 'nullable|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = null;
        $event = PelatihanEvent::create($validated);

        return response()->json(['message' => 'Event Pelatihan berhasil ditambahkan', 'data' => $event], 201);
    }

    public function update(Request $request, $id)
    {
        if (!in_array(auth()->user()->role, ['ketua_sub_kk', 'ketua_kk', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = PelatihanEvent::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string',
            'penyelenggara' => 'required|string',
            'jenis' => 'required|string|in:workshop,sertifikasi,pelatihan,webinar,seminar',
            'topik' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date',
            'triwulan' => 'required|integer|between:1,4',
            'tahun' => 'required|integer',
            'estimasi_biaya' => 'nullable|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json(['message' => 'Event Pelatihan berhasil diperbarui', 'data' => $event]);
    }

    public function destroy($id)
    {
        if (!in_array(auth()->user()->role, ['ketua_sub_kk', 'ketua_kk', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = PelatihanEvent::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event Pelatihan berhasil dihapus']);
    }
}
