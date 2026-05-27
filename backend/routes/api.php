<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Models\SubKk;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/sub-kks', function() {
    return response()->json(SubKk::all());
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me', [AuthController::class, 'updateProfile']);
    Route::post('/me/password', [AuthController::class, 'changePassword']);

    // User Management (Admin/Ketua KK only)
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\UserController::class, 'store']);
    Route::put('/users/{id}', [\App\Http\Controllers\UserController::class, 'update']);
    Route::post('/users/{id}/reset-password', [\App\Http\Controllers\UserController::class, 'resetPassword']);
    Route::get('/capaian/summary', [\App\Http\Controllers\CapaianSummaryController::class, 'getSummary']);

    // Laporan & Distribusi Capaian
    Route::get('/laporan/rekap', [\App\Http\Controllers\LaporanController::class, 'getRekap']);
    Route::get('/laporan/export/rekap', [\App\Http\Controllers\LaporanController::class, 'exportRekap']);
    Route::get('/laporan/detail/{userId}', [\App\Http\Controllers\LaporanController::class, 'getDetail']);
    Route::post('/laporan/remind/{userId}', [\App\Http\Controllers\LaporanController::class, 'remind']);
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'getDashboardData']);

    // Capaian - Publikasi
    Route::get('/publikasis', [\App\Http\Controllers\PublikasiController::class, 'index']);
    Route::post('/publikasis', [\App\Http\Controllers\PublikasiController::class, 'store']);
    Route::put('/publikasis/{id}', [\App\Http\Controllers\PublikasiController::class, 'update']);
    Route::delete('/publikasis/{id}', [\App\Http\Controllers\PublikasiController::class, 'destroy']);

    // Capaian - Hibah
    Route::get('/hibahs', [\App\Http\Controllers\HibahController::class, 'index']);
    Route::post('/hibahs', [\App\Http\Controllers\HibahController::class, 'store']);
    Route::put('/hibahs/{id}', [\App\Http\Controllers\HibahController::class, 'update']);
    Route::delete('/hibahs/{id}', [\App\Http\Controllers\HibahController::class, 'destroy']);

    // Capaian - Paten
    Route::get('/patens', [\App\Http\Controllers\PatenController::class, 'index']);
    Route::post('/patens', [\App\Http\Controllers\PatenController::class, 'store']);
    Route::put('/patens/{id}', [\App\Http\Controllers\PatenController::class, 'update']);
    Route::delete('/patens/{id}', [\App\Http\Controllers\PatenController::class, 'destroy']);

    // Capaian - Abdimas
    Route::get('/abdimas', [\App\Http\Controllers\AbdimasController::class, 'index']);
    Route::post('/abdimas', [\App\Http\Controllers\AbdimasController::class, 'store']);
    Route::put('/abdimas/{id}', [\App\Http\Controllers\AbdimasController::class, 'update']);
    Route::delete('/abdimas/{id}', [\App\Http\Controllers\AbdimasController::class, 'destroy']);

    // Pelatihan - Events
    Route::get('/pelatihan-events', [\App\Http\Controllers\PelatihanEventController::class, 'index']);
    Route::post('/pelatihan-events', [\App\Http\Controllers\PelatihanEventController::class, 'store']);
    Route::put('/pelatihan-events/{id}', [\App\Http\Controllers\PelatihanEventController::class, 'update']);
    Route::delete('/pelatihan-events/{id}', [\App\Http\Controllers\PelatihanEventController::class, 'destroy']);

    // Pelatihan - Participation
    Route::get('/pelatihan-participations', [\App\Http\Controllers\PelatihanParticipationController::class, 'index']);
    Route::post('/pelatihan-participations', [\App\Http\Controllers\PelatihanParticipationController::class, 'store']);
    Route::delete('/pelatihan-participations/{id}', [\App\Http\Controllers\PelatihanParticipationController::class, 'destroy']); // id is event_id here as defined in controller
});
