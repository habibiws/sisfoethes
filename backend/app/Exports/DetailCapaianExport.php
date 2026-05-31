<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DetailCapaianExport implements WithMultipleSheets
{
    protected $year;
    protected $subKkId;

    public function __construct($year, $subKkId)
    {
        $this->year = $year;
        $this->subKkId = $subKkId;
    }

    public function sheets(): array
    {
        return [
            new DetailSheetExport('Publikasi', $this->year, $this->subKkId),
            new DetailSheetExport('Dana Hibah', $this->year, $this->subKkId),
            new DetailSheetExport('Paten & HKI', $this->year, $this->subKkId),
            new DetailSheetExport('Abdimas', $this->year, $this->subKkId),
            new DetailSheetExport('Pelatihan', $this->year, $this->subKkId),
        ];
    }
}
