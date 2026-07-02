<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SubKk;
use App\Models\Publikasi;
use App\Models\Hibah;
use App\Models\Paten;
use App\Models\Abdimas;
use App\Models\PelatihanParticipation;
use Illuminate\Support\Facades\Mail;
use App\Mail\CapaianReminderMail;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RekapCapaianExport;

class LaporanController extends Controller
{
    /**
     * Get the summary rekap for all users.
     */
    public function getRekap(Request $request)
    {
        $currentUser = auth()->user();
        
        // Proteksi: Hanya untuk admin, ketua_kk, ketua_sub_kk
        if (in_array($currentUser->role, ['anggota'])) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk melihat laporan.'], 403);
        }

        $year = $request->input('tahun');
        $subKkId = $request->input('sub_kk_id');
        $search = $request->input('search');

        $usersQuery = User::where('role', '!=', 'admin')->with('subKk');

        if ($subKkId) {
            $usersQuery->where('sub_kk_id', $subKkId);
        }

        if ($search) {
            $usersQuery->where('name', 'like', "%{$search}%");
        }

        // Apply filters directly to standard relationship counts
        $usersQuery->withCount([
            'publikasis' => function ($q) use ($year) {
                if ($year) $q->where('tahun_terbit', $year);
            },
            'hibahs' => function ($q) use ($year) {
                if ($year) $q->where('tahun', $year);
            },
            'patens' => function ($q) use ($year) {
                if ($year) $q->where('tahun', $year);
            },
            'abdimas' => function ($q) use ($year) {
                if ($year) $q->where('tahun', $year);
            },
            'pelatihanParticipations' => function ($q) use ($year) {
                if ($year) {
                    $q->whereHas('event', function ($eventQ) use ($year) {
                        $eventQ->where('tahun', $year);
                    });
                }
            }
        ]);

        $usersQuery->withSum(['hibahs as total_dana_hibah' => function($q) use ($year) {
            if ($year) $q->where('tahun', $year);
        }], 'jumlah_dana');

        $users = $usersQuery->get();

        // Process and map user stats
        $processedUsers = $users->map(function ($user) {
            $pubCount = $user->publikasis_count ?? 0;
            $hibahCount = $user->hibahs_count ?? 0;
            $patenCount = $user->patens_count ?? 0;
            $abdimasCount = $user->abdimas_count ?? 0;
            $latihCount = $user->pelatihan_participations_count ?? 0;

            $totalCapaian = $pubCount + $hibahCount + $patenCount + $abdimasCount + $latihCount;

            // Logika Completeness:
            // Lengkap: Minimal 1 entry di setiap dari 5 kategori
            // Sebagian: Punya entry di sebagian kategori (tapi tidak semua 5)
            // Belum: Nol entry di semua kategori
            $categoriesWithData = 0;
            if ($pubCount > 0) $categoriesWithData++;
            if ($hibahCount > 0) $categoriesWithData++;
            if ($patenCount > 0) $categoriesWithData++;
            if ($abdimasCount > 0) $categoriesWithData++;
            if ($latihCount > 0) $categoriesWithData++;

            $completeness = 'Belum';
            if ($categoriesWithData === 5) {
                $completeness = 'Lengkap';
            } elseif ($categoriesWithData > 0) {
                $completeness = 'Sebagian';
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nidn' => $user->nidn,
                'role' => $user->role,
                'sub_kk' => $user->subKk ? [
                    'id' => $user->subKk->id,
                    'name' => $user->subKk->name,
                    'code' => $user->subKk->code
                ] : null,
                'counts' => [
                    'publikasi' => $pubCount,
                    'hibah' => $hibahCount,
                    'paten' => $patenCount,
                    'abdimas' => $abdimasCount,
                    'pelatihan' => $latihCount
                ],
                'total_dana_hibah' => (float)($user->total_dana_hibah ?? 0),
                'total_capaian' => $totalCapaian,
                'completeness' => $completeness
            ];
        });

        // Compute overall summary stats
        $totalDana = $processedUsers->sum('total_dana_hibah');
        $totalPub = $processedUsers->sum('counts.publikasi');
        $totalHibah = $processedUsers->sum('counts.hibah');
        $totalPaten = $processedUsers->sum('counts.paten');
        $totalAbdimas = $processedUsers->sum('counts.abdimas');
        $totalLatih = $processedUsers->sum('counts.pelatihan');

        return response()->json([
            'summary' => [
                'total_dosen' => $processedUsers->count(),
                'total_publikasi' => $totalPub,
                'total_hibah' => $totalHibah,
                'total_paten' => $totalPaten,
                'total_abdimas' => $totalAbdimas,
                'total_pelatihan' => $totalLatih,
                'total_dana_hibah' => $totalDana
            ],
            'users' => $processedUsers,
            'sub_kks' => SubKk::select('id', 'name', 'code')->get()
        ]);
    }

    /**
     * Get detail capaian for a specific user.
     */
    public function getDetail(Request $request, $userId)
    {
        $currentUser = auth()->user();
        
        // Proteksi: Hanya untuk admin, ketua_kk, ketua_sub_kk
        if (in_array($currentUser->role, ['anggota'])) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk melihat rincian laporan.'], 403);
        }

        $user = User::where('role', '!=', 'admin')->with('subKk')->find($userId);
        if (!$user) {
            return response()->json(['message' => 'Dosen tidak ditemukan.'], 404);
        }

        $year = $request->input('tahun');

        $publikasis = Publikasi::where('user_id', $userId)
            ->when($year, fn($q) => $q->where('tahun_terbit', $year))
            ->get();

        $hibahs = Hibah::where('user_id', $userId)
            ->when($year, fn($q) => $q->where('tahun', $year))
            ->get();

        $patens = Paten::where('user_id', $userId)
            ->when($year, fn($q) => $q->where('tahun', $year))
            ->get();

        $abdimas = Abdimas::where('user_id', $userId)
            ->when($year, fn($q) => $q->where('tahun', $year))
            ->get();

        $pelatihanParticipations = PelatihanParticipation::where('user_id', $userId)
            ->whereHas('event', function ($q) use ($year) {
                if ($year) $q->where('tahun', $year);
            })
            ->with('event')
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'nidn' => $user->nidn,
                'role' => $user->role,
                'sub_kk' => $user->subKk ? [
                    'id' => $user->subKk->id,
                    'name' => $user->subKk->name,
                    'code' => $user->subKk->code
                ] : null
            ],
            'publikasis' => $publikasis,
            'hibahs' => $hibahs,
            'patens' => $patens,
            'abdimas' => $abdimas,
            'pelatihan_participations' => $pelatihanParticipations
        ]);
    }

    /**
     * Send email reminder to user (mocked for now, but configured for route).
     */
    public function remind(Request $request, $userId)
    {
        $currentUser = auth()->user();
        
        if (!in_array($currentUser->role, ['admin', 'ketua_kk', 'ketua_sub_kk'])) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk mengirimkan pengingat.'], 403);
        }

        $user = User::where('role', '!=', 'admin')->find($userId);
        if (!$user) {
            return response()->json(['message' => 'Dosen tidak ditemukan.'], 404);
        }

        // Send real email
        try {
            Mail::to($user->email)->send(new CapaianReminderMail($user, $currentUser));
            return response()->json([
                'message' => "Pengingat berhasil dikirimkan ke email {$user->name} ({$user->email})"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Gagal mengirim email: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export rekap data to Excel.
     */
    public function exportRekap(Request $request)
    {
        $currentUser = auth()->user();
        if (in_array($currentUser->role, ['anggota'])) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk ekspor laporan.'], 403);
        }

        // Re-use logic from getRekap to fetch processed users
        $response = $this->getRekap($request);
        $data = $response->getData(true);
        $users = $data['users'];
        $year = $request->input('tahun');

        return Excel::download(new RekapCapaianExport($users, $year), 'rekap_capaian_dosen.xlsx');
    }

    /**
     * Export detailed tridharma data (multi-sheet) to Excel.
     */
    public function exportDetail(Request $request)
    {
        $currentUser = auth()->user();
        if (in_array($currentUser->role, ['anggota'])) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk ekspor laporan.'], 403);
        }

        $year = $request->input('tahun');
        $subKkId = $request->input('sub_kk_id');

        return Excel::download(new \App\Exports\DetailCapaianExport($year, $subKkId), 'detail_capaian_tridharma.xlsx');
    }

    /**
     * Get list of detailed category data for summary cards.
     */
    public function getCategoryDetail(Request $request)
    {
        $currentUser = auth()->user();
        // Allowed for all authenticated users to view category detail report
        
        $category = $request->input('category');
        $year = $request->input('tahun');
        $subKkId = $request->input('sub_kk_id');

        switch ($category) {
            case 'publikasi':
                $query = Publikasi::with('user.subKk');
                if ($year) $query->where('tahun_terbit', $year);
                if ($subKkId) $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $subKkId));
                $data = $query->orderBy('tahun_terbit', 'desc')->get();
                break;
            case 'hibah':
                $query = Hibah::with('user.subKk');
                if ($year) $query->where('tahun', $year);
                if ($subKkId) $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $subKkId));
                $data = $query->orderBy('tahun', 'desc')->get();
                break;
            case 'paten':
                $query = Paten::with('user.subKk');
                if ($year) $query->where('tahun', $year);
                if ($subKkId) $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $subKkId));
                $data = $query->orderBy('tahun', 'desc')->get();
                break;
            case 'abdimas':
                $query = Abdimas::with('user.subKk');
                if ($year) $query->where('tahun', $year);
                if ($subKkId) $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $subKkId));
                $data = $query->orderBy('tahun', 'desc')->get();
                break;
            case 'pelatihan':
                $query = PelatihanParticipation::with(['user.subKk', 'event']);
                if ($year) {
                    $query->whereHas('event', fn($q) => $q->where('tahun', $year));
                }
                if ($subKkId) $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $subKkId));
                $data = $query->get()->sortByDesc('event.tahun')->values();
                break;
            default:
                return response()->json(['message' => 'Kategori tidak valid.'], 400);
        }

        return response()->json([
            'category' => $category,
            'data' => $data
        ]);
    }
}
