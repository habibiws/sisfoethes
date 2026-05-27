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
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dynamic dashboard data based on year filter and user role.
     */
    public function getDashboardData(Request $request)
    {
        $currentUser = auth()->user();
        $year = $request->input('tahun');

        // 1. Personal Summary (Count of achievements for current logged-in user)
        $personalSummary = [
            'publikasi' => Publikasi::where('user_id', $currentUser->id)
                ->when($year, fn($q) => $q->where('tahun_terbit', $year))
                ->count(),
            'hibah' => Hibah::where('user_id', $currentUser->id)
                ->when($year, fn($q) => $q->where('tahun', $year))
                ->count(),
            'paten' => Paten::where('user_id', $currentUser->id)
                ->when($year, fn($q) => $q->where('tahun', $year))
                ->count(),
            'abdimas' => Abdimas::where('user_id', $currentUser->id)
                ->when($year, fn($q) => $q->where('tahun', $year))
                ->count(),
            'pelatihan' => PelatihanParticipation::where('user_id', $currentUser->id)
                ->whereHas('event', function ($q) use ($year) {
                    if ($year) $q->where('tahun', $year);
                })
                ->count()
        ];

        // 2. Global Summary (Aggregated totals across all non-admin lecturers)
        $usersQuery = User::where('role', '!=', 'admin');

        // Standard relationship counts per user to compute distributions and progress
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

        $users = $usersQuery->with('subKk')->get();

        // Process users to count completeness and totals
        $processedUsers = $users->map(function ($u) {
            $pub = $u->publikasis_count ?? 0;
            $hibah = $u->hibahs_count ?? 0;
            $paten = $u->patens_count ?? 0;
            $abdimas = $u->abdimas_count ?? 0;
            $latih = $u->pelatihan_participations_count ?? 0;

            $total = $pub + $hibah + $paten + $abdimas + $latih;

            // Completeness Logic
            $catsCount = 0;
            if ($pub > 0) $catsCount++;
            if ($hibah > 0) $catsCount++;
            if ($paten > 0) $catsCount++;
            if ($abdimas > 0) $catsCount++;
            if ($latih > 0) $catsCount++;

            $completeness = 'Belum';
            if ($catsCount === 5) {
                $completeness = 'Lengkap';
            } elseif ($catsCount > 0) {
                $completeness = 'Sebagian';
            }

            return [
                'id' => $u->id,
                'name' => $u->name,
                'sub_kk_id' => $u->sub_kk_id,
                'sub_kk_code' => $u->subKk ? $u->subKk->code : null,
                'total_capaian' => $total,
                'completeness' => $completeness,
                'total_dana_hibah' => (float)($u->total_dana_hibah ?? 0),
                'counts' => [
                    'publikasi' => $pub,
                    'hibah' => $hibah,
                    'paten' => $paten,
                    'abdimas' => $abdimas,
                    'pelatihan' => $latih
                ]
            ];
        });

        // Overall stats
        $totalDana = $processedUsers->sum('total_dana_hibah');
        $totalPub = $processedUsers->sum('counts.publikasi');
        $totalHibah = $processedUsers->sum('counts.hibah');
        $totalPaten = $processedUsers->sum('counts.paten');
        $totalAbdimas = $processedUsers->sum('counts.abdimas');
        $totalLatih = $processedUsers->sum('counts.pelatihan');

        $completenessDist = [
            'lengkap' => $processedUsers->where('completeness', 'Lengkap')->count(),
            'sebagian' => $processedUsers->where('completeness', 'Sebagian')->count(),
            'belum' => $processedUsers->where('completeness', 'Belum')->count()
        ];

        // 3. Sub-KK Progress
        $subKks = SubKk::all();
        $subKkProgress = $subKks->map(function ($sub) use ($processedUsers) {
            $members = $processedUsers->where('sub_kk_id', $sub->id);
            $totalMembers = $members->count();

            return [
                'id' => $sub->id,
                'code' => $sub->code,
                'name' => $sub->name,
                'total_members' => $totalMembers,
                'completed' => $members->where('completeness', 'Lengkap')->count(),
                'partial' => $members->where('completeness', 'Sebagian')->count(),
                'none' => $members->where('completeness', 'Belum')->count()
            ];
        });

        // 4. Top 5 Performers
        $topPerformers = $processedUsers->sortByDesc('total_capaian')
            ->take(5)
            ->values()
            ->map(fn($item) => [
                'name' => $item['name'],
                'sub_kk_code' => $item['sub_kk_code'] ?? '—',
                'total_capaian' => $item['total_capaian'],
                'completeness' => $item['completeness']
            ]);

        // 5. Scoped Visibility Logic
        $canViewMemberDetails = in_array($currentUser->role, ['admin', 'ketua_kk', 'ketua_sub_kk']);
        $viewableSubKkIds = [];

        if ($currentUser->role === 'admin' || $currentUser->role === 'ketua_kk') {
            $viewableSubKkIds = $subKks->pluck('id')->toArray();
        } elseif ($currentUser->role === 'ketua_sub_kk' && $currentUser->sub_kk_id) {
            $viewableSubKkIds = [$currentUser->sub_kk_id];
        }

        // Return combined dynamic payload
        return response()->json([
            'user' => [
                'name' => $currentUser->name,
                'role' => $currentUser->role,
                'sub_kk' => $currentUser->subKk ? [
                    'id' => $currentUser->subKk->id,
                    'name' => $currentUser->subKk->name,
                    'code' => $currentUser->subKk->code
                ] : null
            ],
            'personal_summary' => $personalSummary,
            'global_summary' => [
                'total_dosen' => $processedUsers->count(),
                'total_publikasi' => $totalPub,
                'total_hibah' => $totalHibah,
                'total_paten' => $totalPaten,
                'total_abdimas' => $totalAbdimas,
                'total_pelatihan' => $totalLatih,
                'total_dana_hibah' => $totalDana,
                'completeness_distribution' => $completenessDist,
                'sub_kk_progress' => $subKkProgress,
                'category_distribution' => [
                    ['category' => 'Publikasi', 'count' => $totalPub],
                    ['category' => 'Hibah', 'count' => $totalHibah],
                    ['category' => 'Paten', 'count' => $totalPaten],
                    ['category' => 'Abdimas', 'count' => $totalAbdimas],
                    ['category' => 'Pelatihan', 'count' => $totalLatih]
                ]
            ],
            'top_performers' => $topPerformers,
            'can_view_member_details' => $canViewMemberDetails,
            'viewable_sub_kk_ids' => $viewableSubKkIds
        ]);
    }
}
