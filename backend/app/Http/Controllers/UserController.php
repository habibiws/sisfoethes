<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     * Hanya bisa diakses oleh admin atau ketua_kk.
     */
    public function index(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'ketua_kk'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with('subKk')->get();
        return response()->json($users);
    }

    /**
     * Membuat pengguna baru (oleh Admin/Ketua KK).
     */
    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'ketua_kk'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'ketua_kk', 'ketua_sub_kk', 'anggota'])],
            'sub_kk_id' => 'required|exists:sub_kks,id',
            'nidn' => 'nullable|string',
            'nip' => 'nullable|string',
            'prodi' => 'nullable|string',
            'coe' => 'nullable|string',
            'jabatan_fungsional' => 'nullable|string',
        ]);

        // Logika pembatasan role (sama seperti di AuthController)
        if ($request->role === 'ketua_kk' && User::where('role', 'ketua_kk')->exists()) {
            return response()->json(['message' => 'Posisi Ketua KK sudah terisi.'], 400);
        }

        if ($request->role === 'ketua_sub_kk' && User::where('role', 'ketua_sub_kk')->where('sub_kk_id', $request->sub_kk_id)->exists()) {
            return response()->json(['message' => 'Posisi Ketua untuk Sub-KK ini sudah terisi.'], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'sub_kk_id' => $request->sub_kk_id,
            'nidn' => $request->nidn,
            'nip' => $request->nip,
            'prodi' => $request->prodi,
            'coe' => $request->coe,
            'jabatan_fungsional' => $request->jabatan_fungsional,
        ]);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => $user->load('subKk')
        ], 201);
    }

    /**
     * Memperbarui data pengguna.
     */
    public function update(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'ketua_kk'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'ketua_kk', 'ketua_sub_kk', 'anggota'])],
            'sub_kk_id' => 'required|exists:sub_kks,id',
            'nidn' => 'nullable|string',
            'nip' => 'nullable|string',
            'prodi' => 'nullable|string',
            'coe' => 'nullable|string',
            'jabatan_fungsional' => 'nullable|string',
        ]);

        // Proteksi tabrakan role
        if ($request->role === 'ketua_kk' && $user->role !== 'ketua_kk') {
            if (User::where('role', 'ketua_kk')->exists()) {
                return response()->json(['message' => 'Posisi Ketua KK sudah terisi oleh dosen lain.'], 400);
            }
        }

        if ($request->role === 'ketua_sub_kk' && ($user->role !== 'ketua_sub_kk' || $user->sub_kk_id != $request->sub_kk_id)) {
            if (User::where('role', 'ketua_sub_kk')->where('sub_kk_id', $request->sub_kk_id)->exists()) {
                return response()->json(['message' => 'Posisi Ketua untuk Sub-KK ini sudah terisi.'], 400);
            }
        }

        $user->update($request->only(['name', 'email', 'role', 'sub_kk_id', 'nidn', 'nip', 'prodi', 'coe', 'jabatan_fungsional']));

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => $user->load('subKk')
        ]);
    }

    /**
     * Reset password pengguna oleh Admin.
     */
    public function resetPassword(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'ketua_kk'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8'
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password berhasil direset']);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'ketua_kk'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        // Jangan biarkan admin menghapus dirinya sendiri
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri'], 400);
        }

        // Ketua KK tidak boleh menghapus Admin
        if ($user->role === 'admin' && $request->user()->role === 'ketua_kk') {
            return response()->json(['message' => 'Ketua KK tidak memiliki wewenang untuk menghapus akun Super Admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }
}
