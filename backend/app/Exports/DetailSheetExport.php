<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use App\Models\Publikasi;
use App\Models\Hibah;
use App\Models\Paten;
use App\Models\Abdimas;
use App\Models\PelatihanParticipation;

class DetailSheetExport implements FromArray, WithTitle, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $category;
    protected $year;
    protected $subKkId;

    public function __construct(string $category, $year, $subKkId)
    {
        $this->category = $category;
        $this->year = $year;
        $this->subKkId = $subKkId;
    }

    public function title(): string
    {
        return $this->category;
    }

    public function array(): array
    {
        $rows = [];
        $no = 1;

        switch ($this->category) {
            case 'Publikasi':
                $query = Publikasi::with('user.subKk');
                if ($this->year) $query->where('tahun_terbit', $this->year);
                if ($this->subKkId) {
                    $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $this->subKkId));
                }
                $data = $query->get();
                foreach ($data as $item) {
                    $rows[] = [
                        $no++,
                        $item->user->name ?? '—',
                        $item->user->subKk->code ?? '—',
                        $item->judul,
                        $item->jurnal,
                        $item->tahun_terbit,
                        $item->kategori,
                        $item->doi_url ?: '—'
                    ];
                }
                break;

            case 'Dana Hibah':
                $query = Hibah::with('user.subKk');
                if ($this->year) $query->where('tahun', $this->year);
                if ($this->subKkId) {
                    $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $this->subKkId));
                }
                $data = $query->get();
                foreach ($data as $item) {
                    $rows[] = [
                        $no++,
                        $item->user->name ?? '—',
                        $item->user->subKk->code ?? '—',
                        $item->judul,
                        $item->sumber_dana,
                        $item->jumlah_dana,
                        $item->tahun,
                        $item->status
                    ];
                }
                break;

            case 'Paten & HKI':
                $query = Paten::with('user.subKk');
                if ($this->year) $query->where('tahun', $this->year);
                if ($this->subKkId) {
                    $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $this->subKkId));
                }
                $data = $query->get();
                foreach ($data as $item) {
                    $rows[] = [
                        $no++,
                        $item->user->name ?? '—',
                        $item->user->subKk->code ?? '—',
                        $item->judul,
                        $item->jenis,
                        $item->status,
                        $item->tahun
                    ];
                }
                break;

            case 'Abdimas':
                $query = Abdimas::with('user.subKk');
                if ($this->year) $query->where('tahun', $this->year);
                if ($this->subKkId) {
                    $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $this->subKkId));
                }
                $data = $query->get();
                foreach ($data as $item) {
                    $rows[] = [
                        $no++,
                        $item->user->name ?? '—',
                        $item->user->subKk->code ?? '—',
                        $item->judul,
                        $item->mitra,
                        $item->tahun
                    ];
                }
                break;

            case 'Pelatihan':
                $query = PelatihanParticipation::with(['user.subKk', 'event']);
                if ($this->year) {
                    $query->whereHas('event', fn($q) => $q->where('tahun', $this->year));
                }
                if ($this->subKkId) {
                    $query->whereHas('user', fn($q) => $q->where('sub_kk_id', $this->subKkId));
                }
                $data = $query->get();
                foreach ($data as $item) {
                    $rows[] = [
                        $no++,
                        $item->user->name ?? '—',
                        $item->user->subKk->code ?? '—',
                        $item->event->name ?? '—',
                        $item->event->tanggal_mulai ?? '—',
                        $item->event->tanggal_selesai ?? '—',
                        $item->event->tahun ?? '—',
                        $item->event->keterangan ?: '—'
                    ];
                }
                break;
        }

        return $rows;
    }

    public function headings(): array
    {
        $headers = [];
        $headers[] = ["DATA DETAIL LENGKAP CAPAIAN - KATEGORI {$this->category}"];
        $periode = $this->year ? "Tahun {$this->year}" : "Semua Tahun";
        $headers[] = ["Periode: {$periode}"];
        $headers[] = [""];

        switch ($this->category) {
            case 'Publikasi':
                $headers[] = ['No', 'Nama Dosen', 'Sub-KK', 'Judul Publikasi', 'Jurnal/Konferensi', 'Tahun Terbit', 'Kategori', 'DOI/URL'];
                break;
            case 'Dana Hibah':
                $headers[] = ['No', 'Nama Dosen', 'Sub-KK', 'Judul Penelitian', 'Sumber Dana', 'Jumlah Dana (Rp)', 'Tahun', 'Status'];
                break;
            case 'Paten & HKI':
                $headers[] = ['No', 'Nama Dosen', 'Sub-KK', 'Judul Paten/HKI', 'Jenis', 'Status', 'Tahun'];
                break;
            case 'Abdimas':
                $headers[] = ['No', 'Nama Dosen', 'Sub-KK', 'Judul Abdimas', 'Mitra', 'Tahun'];
                break;
            case 'Pelatihan':
                $headers[] = ['No', 'Nama Dosen', 'Sub-KK', 'Nama Pelatihan', 'Tanggal Mulai', 'Tanggal Selesai', 'Tahun', 'Keterangan'];
                break;
        }

        return $headers;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:G1');
        $sheet->mergeCells('A2:G2');

        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            2 => ['font' => ['bold' => true]],
            4 => ['font' => ['bold' => true], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'color' => ['rgb' => 'E8F5EA']]],
        ];
    }
}
