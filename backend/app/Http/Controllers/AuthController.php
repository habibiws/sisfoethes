<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'nidn' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'prodi' => 'required|string',
            'sub_kk_id' => 'required|exists:sub_kks,id',
            'role' => 'required|in:anggota,ketua_sub_kk,ketua_kk'
        ]);

        if ($request->role === 'ketua_kk') {
            if (User::where('role', 'ketua_kk')->exists()) {
                return response()->json(['message' => 'Posisi Ketua KK sudah terisi.'], 400);
            }
        }

        if ($request->role === 'ketua_sub_kk') {
            if (User::where('role', 'ketua_sub_kk')->where('sub_kk_id', $request->sub_kk_id)->exists()) {
                return response()->json(['message' => 'Posisi Ketua untuk Sub-KK ini sudah terisi.'], 400);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'nidn' => $request->nidn,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'prodi' => $request->prodi,
            'sub_kk_id' => $request->sub_kk_id,
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token, 'message' => 'Registrasi berhasil']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json(['user' => $user, 'token' => $token, 'message' => 'Login berhasil']);
        }

        return response()->json(['message' => 'Email atau password salah'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('subKk');
        return response()->json(['user' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name' => 'required|string|max:255',
            'nidn' => 'nullable|string',
            'prodi' => 'nullable|string',
            'nip' => 'nullable|string',
            'coe' => 'nullable|string',
            'jabatan_fungsional' => 'nullable|string',
        ];

        if (in_array($user->role, ['admin', 'ketua_kk'])) {
            $rules['sub_kk_id'] = 'nullable|exists:sub_kks,id';
        }

        $validatedData = $request->validate($rules);
        $user->update($validatedData);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user->load('subKk')
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Password lama tidak sesuai'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah']);
    }
}
