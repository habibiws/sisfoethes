<?php

namespace App\Http\Controllers;

use App\Models\Abdimas;
use Illuminate\Http\Request;

class AbdimasController extends Controller
{
    public function index()
    {
        return response()->json(Abdimas::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'skema' => 'required|string|in:mandiri,pendanaan_internal,pendanaan_eksternal',
            'posisi' => 'required|string|in:ketua,anggota',
            'mitra' => 'required|string',
            'lokasi' => 'nullable|string',
            'tahun' => 'required|integer',
            'jumlah_dana' => 'nullable|numeric',
        ]);

        $validated['user_id'] = auth()->id();
        $abdimas = Abdimas::create($validated);

        return response()->json(['message' => 'Abdimas berhasil ditambahkan', 'data' => $abdimas], 201);
    }

    public function update(Request $request, $id)
    {
        $abdimas = Abdimas::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string',
            'skema' => 'required|string|in:mandiri,pendanaan_internal,pendanaan_eksternal',
            'posisi' => 'required|string|in:ketua,anggota',
            'mitra' => 'required|string',
            'lokasi' => 'nullable|string',
            'tahun' => 'required|integer',
            'jumlah_dana' => 'nullable|numeric',
        ]);

        $abdimas->update($validated);

        return response()->json(['message' => 'Abdimas berhasil diperbarui', 'data' => $abdimas]);
    }

    public function destroy($id)
    {
        $abdimas = Abdimas::where('user_id', auth()->id())->findOrFail($id);
        $abdimas->delete();

        return response()->json(['message' => 'Abdimas berhasil dihapus']);
    }
}
