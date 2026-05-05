<?php

namespace App\Http\Controllers;

use App\Models\Hibah;
use Illuminate\Http\Request;

class HibahController extends Controller
{
    public function index()
    {
        return response()->json(Hibah::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'sumber_dana' => 'required|string|in:internal,eksternal_dn,eksternal_ln',
            'posisi' => 'required|string|in:ketua,anggota',
            'nama_pemberi' => 'required|string',
            'tahun' => 'required|integer',
            'jumlah_dana' => 'nullable|numeric',
        ]);

        $validated['user_id'] = auth()->id();
        $hibah = Hibah::create($validated);

        return response()->json(['message' => 'Hibah berhasil ditambahkan', 'data' => $hibah], 201);
    }

    public function update(Request $request, $id)
    {
        $hibah = Hibah::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string',
            'sumber_dana' => 'required|string|in:internal,eksternal_dn,eksternal_ln',
            'posisi' => 'required|string|in:ketua,anggota',
            'nama_pemberi' => 'required|string',
            'tahun' => 'required|integer',
            'jumlah_dana' => 'nullable|numeric',
        ]);

        $hibah->update($validated);

        return response()->json(['message' => 'Hibah berhasil diperbarui', 'data' => $hibah]);
    }

    public function destroy($id)
    {
        $hibah = Hibah::where('user_id', auth()->id())->findOrFail($id);
        $hibah->delete();

        return response()->json(['message' => 'Hibah berhasil dihapus']);
    }
}
