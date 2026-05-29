/* ════════════════════════════════════════════════════════
   QualityOS — Set de íconos SVG (estilo Lucide)
   icons.js · Mayo 2026
   ════════════════════════════════════════════════════════
   USO:
     1. Incluir en el HTML:  <script src="/icons.js"></script>
     2. Insertar un ícono:   qIcon('search')           → string SVG 24px
                             qIcon('search', 18)        → tamaño custom
                             qIcon('search', 20, 'var(--accent)') → color forzado
     3. Auto-reemplazo:      data-icon="search" en cualquier elemento
                             → qIconsAuto() reemplaza el contenido por el SVG
   Todos usan currentColor → respetan el tema dark/light.
   ════════════════════════════════════════════════════════ */

(function (global) {
  // Atributos comunes de stroke
  var ST = 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"';

  // Paths de cada ícono (viewBox 0 0 24 24)
  var PATHS = {
    // ── Navegación / Topbar ──
    search:   '<circle cx="11" cy="11" r="8" %S%/><path d="m21 21-4.3-4.3" %S%/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" %S%/><circle cx="12" cy="12" r="3" %S%/>',
    home:     '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" %S%/><polyline points="9 22 9 12 15 12 15 22" %S%/>',
    moon:     '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" %S%/>',
    sun:      '<circle cx="12" cy="12" r="4" %S%/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" %S%/>',
    logout:   '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" %S%/><polyline points="16 17 21 12 16 7" %S%/><line x1="21" x2="9" y1="12" y2="12" %S%/>',
    eye:      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" %S%/><circle cx="12" cy="12" r="3" %S%/>',

    // ── Módulos ──
    clipboard:'<rect width="8" height="4" x="8" y="2" rx="1" %S%/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" %S%/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" %S%/>',
    warning:  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" %S%/><path d="M12 9v4M12 17h.01" %S%/>',
    folder:   '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" %S%/>',

    // ── Secciones REG-01 ──
    package:  '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" %S%/><path d="m3.3 7 8.7 5 8.7-5M12 22V12" %S%/>',
    microscope:'<path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1" %S%/><path d="M9 14h2" %S%/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" %S%/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" %S%/>',
    checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" %S%/><polyline points="22 4 12 14.01 9 11.01" %S%/>',
    camera:   '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" %S%/><circle cx="12" cy="13" r="3" %S%/>',
    lock:     '<rect width="18" height="11" x="3" y="11" rx="2" %S%/><path d="M7 11V7a5 5 0 0 1 10 0v4" %S%/>',

    // ── Acciones ──
    save:     '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" %S%/><polyline points="17 21 17 13 7 13 7 21" %S%/><polyline points="7 3 7 8 15 8" %S%/>',
    archive:  '<rect width="20" height="5" x="2" y="3" rx="1" %S%/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" %S%/><path d="M10 12h4" %S%/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" %S%/><polyline points="7 10 12 15 17 10" %S%/><line x1="12" x2="12" y1="15" y2="3" %S%/>',
    print:    '<polyline points="6 9 6 2 18 2 18 9" %S%/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" %S%/><rect width="12" height="8" x="6" y="14" %S%/>',
    trash:    '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" %S%/>',
    document: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" %S%/><path d="M14 2v4a2 2 0 0 0 2 2h4" %S%/>',
    plus:     '<path d="M5 12h14M12 5v14" %S%/>',

    // ── Alias para los emojis comunes ──
    add: null  // se resuelve abajo
  };
  PATHS.add = PATHS.plus;

  // Mapa emoji → nombre de ícono (para auto-reemplazo)
  var EMOJI_MAP = {
    '🔍':'search', '⚙':'settings', '🏠':'home', '🌙':'moon', '☀':'sun',
    '🚪':'logout', '👁':'eye', '📋':'clipboard', '⚠':'warning', '📂':'folder',
    '📁':'archive', '📦':'package', '🔬':'microscope', '✅':'checkCircle',
    '📷':'camera', '🔒':'lock', '💾':'save', '⬇':'download', '🖨':'print',
    '🗑':'trash', '📄':'document', '➕':'plus'
  };

  // Generador de SVG
  function qIcon(name, size, color) {
    var p = PATHS[name];
    if (!p) { console.warn('[qIcon] no existe:', name); return ''; }
    size = size || 24;
    var st = color ? ST.replace('currentColor', color) : ST;
    var body = p.replace(/%S%/g, st);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' +
           size + '" height="' + size + '" style="flex-shrink:0;vertical-align:middle;">' +
           body + '</svg>';
  }

  // Auto-reemplazo: busca [data-icon="nombre"] y le inyecta el SVG
  function qIconsAuto(root) {
    root = root || document;
    var els = root.querySelectorAll('[data-icon]');
    els.forEach(function (el) {
      var name = el.getAttribute('data-icon');
      var size = parseInt(el.getAttribute('data-icon-size') || '24', 10);
      var color = el.getAttribute('data-icon-color') || null;
      el.innerHTML = qIcon(name, size, color);
    });
  }

  global.qIcon = qIcon;
  global.qIconsAuto = qIconsAuto;
  global.QIconMap = EMOJI_MAP;

  // Auto-ejecutar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ qIconsAuto(); });
  } else {
    qIconsAuto();
  }
})(window);
