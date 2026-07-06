<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapCapaianExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $data;
    protected $year;

    public function __construct(array $data, $year)
    {
        $this->data = $data;
        $this->year = $year;
    }

    public function array(): array
    {
        $rows = [];
        $no = 1;
        foreach ($this->data as $user) {
            $rows[] = [
                $no++,
                $user['name'],
                $user['sub_kk']['code'] ?? '—',
                $user['counts']['publikasi'],
                $user['counts']['hibah'],
                $user['counts']['paten'],
                $user['counts']['abdimas'],
                $user['counts']['pelatihan'],
                $user['total_capaian'],
                $user['total_dana_hibah'],
                $user['completeness']
            ];
        }
        return $rows;
    }

    public function headings(): array
    {
        $periode = $this->year ? "Tahun {$this->year}" : "Semua Tahun";
        return [
            ['LAPORAN REKAPITULASI CAPAIAN TRIDHARMA - KK EEATS'],
            ['Periode: ' . $periode],
            [''],
            [
                'No',
                'Nama Dosen',
                'Sub-KK',
                'Publikasi',
                'Hibah',
                'Paten & HKI',
                'Abdimas',
                'Pelatihan',
                'Total Capaian',
                'Total Dana Hibah (Rp)',
                'Status Kelengkapan'
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:K1');
        $sheet->mergeCells('A2:K2');

        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            2 => ['font' => ['bold' => true]],
            4 => ['font' => ['bold' => true], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'color' => ['rgb' => 'EBF2F9']]],
        ];
    }
}
