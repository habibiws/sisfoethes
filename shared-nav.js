// shared-nav.js — inject navbar + sidebar into every page
function buildNav(activePage) {
  const pages = [
    { id:'dashboard', label:'Dashboard',      href:'dashboard.html' },
    { id:'about',     label:'Tentang KK',     href:'about.html' },
    { id:'capaian',   label:'Input Capaian',  href:'capaian.html' },
    { id:'pelatihan', label:'Pelatihan KK',   href:'pelatihan.html' },
    { id:'laporan',   label:'Laporan',        href:'laporan.html' },
  ];
  const navLinks = pages.map(p =>
    `<a class="nav-link${p.id===activePage?' active':''}" href="${p.href}">${p.label}</a>`
  ).join('');

  document.getElementById('navbar').innerHTML = `
    <a class="nav-brand" href="dashboard.html">
      <div class="nav-logo-mark">KK</div>
      <div class="nav-brand-text">
        <div class="nav-brand-title">ETHES</div>
        <div class="nav-brand-sub">Tel-U Surabaya</div>
      </div>
    </a>
    <div class="nav-links">${navLinks}</div>
    <div class="nav-right">
      <div class="nav-role-badge">Ketua Sub-KK</div>
      <div class="nav-user">
        <div class="nav-avatar">MY</div>
        <div class="nav-name">M. Yani</div>
      </div>
    </div>
  `;

  const sidebarItems = [
    { section:'Menu Utama' },
    { id:'dashboard',  icon:'📊', label:'Dashboard',           href:'dashboard.html' },
    { id:'about',      icon:'ℹ️',  label:'Tentang KK ETHES',    href:'about.html' },
    { divider:true },
    { section:'Capaian Saya' },
    { id:'capaian',    icon:'✏️', label:'Input Capaian',        href:'capaian.html', badge:'Baru' },
    { id:'laporan',    icon:'📈', label:'Laporan & Distribusi', href:'laporan.html' },
    { divider:true },
    { section:'Ketua Sub-KK' },
    { id:'pelatihan',  icon:'🎓', label:'Kelola Pelatihan KK',  href:'pelatihan.html', badge:'KSK' },
    { divider:true },
    { section:'Ketua KK' },
    { id:'rekap',      icon:'🔍', label:'Rekap Semua Dosen',    href:'laporan.html' },
    { id:'export',     icon:'📥', label:'Export Laporan',       href:'laporan.html' },
  ];

  const sidebarHtml = sidebarItems.map(item => {
    if (item.section) return `<div class="sidebar-label">${item.section}</div>`;
    if (item.divider) return `<div class="sidebar-divider"></div>`;
    const active = item.id === activePage ? ' active' : '';
    const badge = item.badge ? `<span class="si-badge">${item.badge}</span>` : '';
    return `<a class="sidebar-item${active}" href="${item.href}"><div class="si-icon">${item.icon}</div>${item.label}${badge}</a>`;
  }).join('');

  document.getElementById('sidebar').innerHTML = sidebarHtml + `
    <div style="margin-top:auto;padding-top:12px;">
      <div class="sidebar-info">
        <div class="sidebar-info-label">Periode Aktif</div>
        <div class="sidebar-info-val">Sem. Genap 2024/2025</div>
        <div class="sidebar-info-sub">Deadline: 30 Juni 2025</div>
      </div>
    </div>
  `;
}

function setPageHeader(title, subtitle, role) {
  const headerHTML = `
    <div class="page-header">
      <div class="flex-between">
        <div>
          <div class="page-title">${title}</div>
          <div class="page-sub">${subtitle}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Peran Anda</div>
          <div style="font-size:13px;font-weight:700;color:var(--navy)">${role}</div>
        </div>
      </div>
    </div>
  `;
  
  document.querySelector('.page-header').outerHTML = headerHTML;
}
