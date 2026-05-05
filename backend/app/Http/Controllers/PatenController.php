<?php

namespace App\Http\Controllers;

use App\Models\Paten;
use Illuminate\Http\Request;

class PatenController extends Controller
{
    public function index()
    {
        return response()->json(Paten::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'jenis_hki' => 'required|string|in:paten,paten_sederhana,hak_cipta,desain_industri,merek',
            'nomor_registrasi' => 'nullable|string',
            'status' => 'required|string|in:terdaftar,granted,dalam_proses',
            'tahun' => 'required|integer',
        ]);

        $validated['user_id'] = auth()->id();
        $paten = Paten::create($validated);

        return response()->json(['message' => 'Paten/HKI berhasil ditambahkan', 'data' => $paten], 201);
    }

    public function update(Request $request, $id)
    {
        $paten = Paten::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string',
            'jenis_hki' => 'required|string|in:paten,paten_sederhana,hak_cipta,desain_industri,merek',
            'nomor_registrasi' => 'nullable|string',
            'status' => 'required|string|in:terdaftar,granted,dalam_proses',
            'tahun' => 'required|integer',
        ]);

        $paten->update($validated);

        return response()->json(['message' => 'Paten/HKI berhasil diperbarui', 'data' => $paten]);
    }

    public function destroy($id)
    {
        $paten = Paten::where('user_id', auth()->id())->findOrFail($id);
        $paten->delete();

        return response()->json(['message' => 'Paten/HKI berhasil dihapus']);
    }
}
