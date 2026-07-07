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

        $verificationToken = Str::random(40);

        $user = User::create([
            'name' => $request->name,
            'nidn' => $request->nidn,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'prodi' => $request->prodi,
            'sub_kk_id' => $request->sub_kk_id,
            'role' => $request->role,
            'remember_token' => $verificationToken,
        ]);

        // Send Email Verification
        $verificationLink = env('FRONTEND_URL', 'https://kkeeats.com') . "/verify-email?email=" . urlencode($user->email) . "&token=" . $verificationToken;

        try {
            Mail::raw("Halo {$user->name},\n\nTerima kasih telah mendaftar di EEATS Portal.\n\nSilakan klik tautan berikut untuk memverifikasi alamat email Anda:\n{$verificationLink}\n\nJika tautan tidak bisa di-klik, Anda dapat menyalin dan menempelkannya langsung ke peramban (browser) Anda.\n\nSalam hangat,\nKelompok Keahlian EEATS", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Verifikasi Alamat Email - EEATS Portal');
            });
        } catch (\Exception $e) {
            \Log::error("Gagal mengirim email verifikasi ke {$user->email}: " . $e->getMessage());
        }

        return response()->json(['user' => $user, 'message' => 'Registrasi berhasil! Silakan periksa inbox email Anda untuk melakukan verifikasi sebelum masuk.']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Require Email Verification
            if ($user->email_verified_at === null) {
                Auth::logout();
                return response()->json(['message' => 'Email Anda belum terverifikasi. Silakan periksa inbox email Anda untuk melakukan verifikasi.'], 403);
            }

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
            Mail::raw("Halo,\n\nAnda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.\n\nKode verifikasi reset sandi Anda adalah: {$token}\n\nMasukkan kode ini di aplikasi untuk mereset kata sandi Anda. Kode ini berlaku selama 60 menit.\n\nJika Anda tidak meminta reset sandi, abaikan email ini.\n\nSalam,\nKelompok Keahlian EEATS", function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Kode Reset Kata Sandi - EEATS Portal');
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
