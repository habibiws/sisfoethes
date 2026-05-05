import React from 'react';

export default function ProfileEditForm({ formData, setFormData, onSave, onCancel, isSaving, userRole }) {
  const canEditSubKk = userRole === 'ketua_kk' || userRole === 'admin';

  return (
    <div className="profile-edit-container">
      <div className="form-group mb-16">
        <label>Nama Lengkap</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          placeholder="Nama Lengkap" 
        />
      </div>

      <div className="form-grid mb-16">
        <div className="form-group">
          <label>NIDN</label>
          <input 
            type="text" 
            value={formData.nidn} 
            onChange={e => setFormData({...formData, nidn: e.target.value})} 
            placeholder="NIDN" 
          />
        </div>
        <div className="form-group">
          <label>NIP</label>
          <input 
            type="text" 
            value={formData.nip} 
            onChange={e => setFormData({...formData, nip: e.target.value})} 
            placeholder="NIP" 
          />
        </div>
      </div>

      <div className="form-group mb-16">
        <label>Program Studi</label>
        <input 
          type="text" 
          value={formData.prodi} 
          onChange={e => setFormData({...formData, prodi: e.target.value})} 
          placeholder="Program Studi" 
        />
      </div>

      <div className="form-grid mb-16">
        <div className="form-group">
          <label>Sub-Kelompok Keahlian</label>
          {canEditSubKk ? (
            <select 
              value={formData.sub_kk_id} 
              onChange={e => setFormData({...formData, sub_kk_id: e.target.value})}
            >
              <option value="1">CORES — Control, Automation, Robotics & Embedded</option>
              <option value="2">PORSCE — Power System & Energy Conversion</option>
              <option value="3">BEE — Basic Electronics</option>
              <option value="4">COMMET — Communication Network</option>
              <option value="5">COS(PI) — Telecommunication & Signal Processing</option>
            </select>
          ) : (
            <div className="info-box readonly">
              {formData.sub_kk_name || 'Terdaftar di KK ETHES'}
              <div className="form-hint">Hanya Ketua KK yang dapat mengubah Sub-KK Anda.</div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Center of Excellence (CoE)</label>
          <select 
            value={formData.coe} 
            onChange={e => setFormData({...formData, coe: e.target.value})}
          >
            <option value="">-- Pilih CoE --</option>
            <option value="INTEREST">INTEREST</option>
            <option value="Moshee">Moshee</option>
            <option value="Circlest">Circlest</option>
          </select>
        </div>
      </div>

      <div className="form-group mb-16">
        <label>Jabatan Fungsional</label>
        <select 
          value={formData.jabatan_fungsional} 
          onChange={e => setFormData({...formData, jabatan_fungsional: e.target.value})}
        >
          <option value="">-- Pilih Jabatan --</option>
          <option value="NJFA 2">NJFA 2</option>
          <option value="NJFA 3">NJFA 3</option>
          <option value="AA 2">AA 2</option>
          <option value="AA 3">AA 3</option>
          <option value="Lektor 2">Lektor 2</option>
          <option value="Lektor 3">Lektor 3</option>
          <option value="Lektor Kepala">Lektor Kepala</option>
          <option value="Guru Besar">Guru Besar</option>
        </select>
      </div>

      <div className="btn-row">
        <button className="btn btn-ghost" onClick={onCancel} disabled={isSaving}>Batal</button>
        <button className="btn btn-primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}
