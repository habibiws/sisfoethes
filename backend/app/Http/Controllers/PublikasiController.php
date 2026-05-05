<?php

namespace App\Http\Controllers;

use App\Models\Publikasi;
use Illuminate\Http\Request;

class PublikasiController extends Controller
{
    public function index()
    {
        return response()->json(Publikasi::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string',
            'jenis' => 'required|string|in:jurnal_internasional_scopus,jurnal_nasional_sinta,jurnal_nasional_non_sinta,prosiding_internasional_scopus,prosiding_nasional',
            'posisi_penulis' => 'required|string|in:penulis_pertama,corresponding,penulis_lainnya',
            'nama_jurnal' => 'required|string',
            'tahun_terbit' => 'required|integer',
            'doi_url' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $publikasi = Publikasi::create($validated);

        return response()->json(['message' => 'Publikasi berhasil ditambahkan', 'data' => $publikasi], 201);
    }

    public function update(Request $request, $id)
    {
        $publikasi = Publikasi::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string',
            'jenis' => 'required|string|in:jurnal_internasional_scopus,jurnal_nasional_sinta,jurnal_nasional_non_sinta,prosiding_internasional_scopus,prosiding_nasional',
            'posisi_penulis' => 'required|string|in:penulis_pertama,corresponding,penulis_lainnya',
            'nama_jurnal' => 'required|string',
            'tahun_terbit' => 'required|integer',
            'doi_url' => 'nullable|string',
        ]);

        $publikasi->update($validated);

        return response()->json(['message' => 'Publikasi berhasil diperbarui', 'data' => $publikasi]);
    }

    public function destroy($id)
    {
        $publikasi = Publikasi::where('user_id', auth()->id())->findOrFail($id);
        $publikasi->delete();

        return response()->json(['message' => 'Publikasi berhasil dihapus']);
    }
}
