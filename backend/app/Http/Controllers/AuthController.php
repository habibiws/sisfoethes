<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        return response()->json(['message' => 'Pendaftaran mandiri dinonaktifkan. Silakan hubungi Admin Kelompok Keahlian untuk mendaftarkan akun.'], 403);
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

    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'check_registered' => 'nullable|boolean'
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json([
            'exists' => $exists,
            'message' => $exists ? 'Email sudah terdaftar.' : 'Email belum terdaftar.'
        ]);
    }

    public function checkNidn(Request $request)
    {
        $request->validate([
            'nidn' => 'required|string',
        ]);

        $exists = User::where('nidn', $request->nidn)->exists();

        return response()->json([
            'exists' => $exists,
            'message' => $exists ? 'NIDN sudah terdaftar.' : 'NIDN belum terdaftar.'
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }

        if ($user->email_verified_at !== null) {
            return response()->json(['message' => 'Email Anda sudah terverifikasi sebelumnya. Silakan login.']);
        }

        if ($user->remember_token !== $request->token) {
            return response()->json(['message' => 'Token verifikasi tidak valid.'], 400);
        }

        $user->email_verified_at = now();
        $user->remember_token = null;
        $user->save();

        return response()->json(['message' => 'Email Anda berhasil diverifikasi! Silakan login.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email tidak terdaftar.'
        ]);

        $token = rand(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        try {
            Mail::raw("Halo,\n\nAnda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.\n\nKode verifikasi reset sandi Anda adalah: {$token}\n\nMasukkan kode ini di aplikasi untuk mereset kata sandi Anda. Kode ini berlaku selama 60 menit.\n\nJika Anda tidak meminta reset sandi, abaikan email ini.\n\nSalam,\nKelompok Keahlian EEAT", function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Kode Reset Kata Sandi - EEAT Portal');
            });
        } catch (\Exception $e) {
            \Log::error("Gagal mengirim email reset sandi ke {$request->email}: " . $e->getMessage());
            return response()->json(['message' => 'Gagal mengirim email reset. Silakan coba sesaat lagi.'], 500);
        }

        return response()->json(['message' => 'Kode reset kata sandi telah dikirim ke email Anda.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Kode reset tidak valid atau sudah kedaluwarsa.'], 400);
        }

        if (now()->subMinutes(60)->gt($record->created_at)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Kode reset sudah kedaluwarsa.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Kata sandi berhasil diperbarui. Silakan login dengan sandi baru Anda.']);
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
