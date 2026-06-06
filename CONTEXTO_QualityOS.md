# CONTEXTO_QualityOS.md
_Referencia rápida del proyecto sgc-agrofacil / QualityOS_
_Última actualización: 06/06/2026_

---

## §1 Stack y descripción
- **App web PWA** — HTML/CSS/JS vanilla, sin frameworks
- **Backend:** Firebase (Auth + Firestore + Hosting)
- **Repo:** GitHub → `maxyroca7/sgc-agrofacil` (rama `main`)
- **Deploy:** `firebase deploy --project sgc-agrofacil` — manual, solo el usuario
- **URL producción:** `https://sgc-agrofacil.web.app`
- **Usuarios:** roles `checker` / `coordinadora`; autenticación via `authGuard()`
- **Firefox:** no usar en PC de oficina para escrituras (bloquea Firestore)

---

## §2 Archivos clave

| Archivo | Función |
|---------|---------|
| `REG01_planilla_digital.html` | Planilla principal — Control en Línea (CL) y Control Final (CF). ~2700 líneas |
| `registro_nc.html` | Registro de No Conformidades — tabla editable + sync Firestore + cards mobile |
| `historial.html` | Vista histórica de lotes |
| `coordinadora.html` | Vista solo lectura para coordinadora |
| `home.html` | Pantalla de inicio post-login |
| `login.html` | Autenticación. Start URL de la PWA |
| `sync.js` | Capa de sincronización Firestore ↔ localStorage. Parcha localStorage e IndexedDB |
| `firebase-init.js` | Init Firebase, `authGuard()`, `getRol()`, `cerrarSesion()` |

---

## §3 Flujo de trabajo

```
git pull → cambios con CC → commit → push → firebase deploy (usuario)
```

- Siempre `git pull` antes de editar
- CC muestra diff antes de aplicar — confirmar antes de commitear
- Dos terminales: una para CC, otra solo para deploy (flecha arriba + Enter)
- No deployar sin confirmación del usuario

---

## §4 Persistencia y sync

| Storage | Qué guarda |
|---------|-----------|
| `localStorage` key `reg01_lotes_v3` | Array de lotes REG01 |
| `localStorage` key `reg01_nc_pendientes` | Canal handoff REG01 → NC |
| `IndexedDB` store `agrofacil_nc_v6` | Cache local NCs |
| Firestore `lotes/{id}` | Un documento por lote |
| Firestore `nc/registro` | Documento único con `rows[]` de todas las NCs |
| Firestore `usuarios/{uid}` | Rol del usuario |
| Firestore `config/empresa` | ⭐ NUEVO — configuración dinámica de la empresa |

**Regla de merge lotes:** remoto gana si `r._ts > local._ts`
**sync.js:** parcha `localStorage.setItem` para detectar guardados y pushear a Firestore automáticamente

---

## §5 Resuelto (historial)

- **Botón × para borrar pallet en CL.** Commit `6caa786`
- **Semáforo PESO NOK** se apaga al corregir
- **NC → Firestore** (`nc/registro`) funcionando cross-device
- **Fix pérdida de datos CL:** debounce 1.5s + visibilitychange/pagehide + acNC guarda al inicio
- **Lotes fantasma** limpiados
- **PDF archivar — 8 fixes de layout:**
  - Logo más grande en encabezado
  - Quitar columna "Valor ind." CF
  - Quitar columna PROM de CL
  - Observaciones como sub-fila debajo del pallet (CL y CF)
  - Footer fijo al pie de página (position:fixed en @media print)
  - Sub-headers CL con color teal (fix especificidad CSS `#print-body .tw table th:first-child`)
  - Sin footer duplicado (.app-footer oculto en print)
  - Commits: `a07f565`, `91ff995`, `e857441`, `13ff7b6`, `ee3fa8a`, `46bc8bd`
- **Fix foco registro_nc:** `render()` guarda y restaura input activo antes/después de destruir tbody. Resuelve pérdida de foco al escribir en mobile por snapshots entrantes. Commit `46bc8bd`
- **Cards colapsables NC mobile:** cada NC como card con header (#N, lote, producto, badge gravedad, ▶). Estado colapsado por defecto, última expandida. Orden invertido en mobile (más reciente arriba)
- **Botón × en card NC mobile:** elimina fila con confirm(). stopPropagation para no expandir
- **Ancho completo registro_nc en PC:** contenedor al 100%
- **Documentación:** `ARQUITECTURA_QualityOS.md` generado — modelo de datos completo, flujos de sync, componentes REG01, deuda técnica
- **Acuerdo de licencia:** `QualityOS_Acuerdo_Uso.md` generado — protege propiedad intelectual ante Agrofacil
- **Plan de producto y negocio:** `QualityOS_Plan_Producto_Negocio.md` — modelo consultoría, cliente objetivo, roadmap 90 días
- **Diseño v2 en Claude Design** — 5 pantallas diseñadas con identidad visual conservada:
  `admin.html`, `home.html`, `login.html`, `historial.html`, `coordinadora.html`

---

## §6 Pendiente (en orden de prioridad)

### 1. QR modal post-escaneo ⭐ (prompt listo, falta aplicar y probar en planta)
Prompt completo generado. Cambios:
- `_mostrarModalQR(rawVal, label, onConfirm)` — modal con URL completa, URL corta, botón Abrir, botones CARGADA/NO CARGADA/Cancelar
- `scanQR()` y `scanQRCF()` — llaman al modal en vez de guardar directo
- Badge `qrUrlCargada` en card del pallet (verde ✓ / rojo ✗ / gris sin verificar)
- Sección "QRs del lote" — lista todos los QR escaneados del lote con estado
- El QR es un bit.ly — verificación es visual (el usuario abre la URL y confirma)
- `qrLineaOK` (OK/NOK) **no se toca** — son estados independientes

### 2. Implementar diseños v2 con CC (en orden)
Exportar HTMLs de Claude Design e implementar:
1. `login.html` → reemplaza el actual, conectar Firebase Auth real
2. `home.html` → reemplaza el actual, leer `config/empresa` de Firestore
3. `admin.html` → nuevo, lee/escribe `config/empresa` en Firestore (Opción A: solo el implementador)
4. `coordinadora.html` → reemplaza el actual
5. `historial.html` → reemplaza el actual
6. `registro_nc.html` → rediseño visual manteniendo lógica actual
- Todas las páginas leen `config/empresa` para nombre y logo dinámico
- `REG01_planilla_digital.html` → último, cuando todo lo demás esté estable

### 3. Decisión REPRO de peso
¿Es un proceso real de reproceso o corrección de tipeo? Define el flujo de NC generado.

### 4. Sync lotes en tiempo real
`escucharLotes` no llama `renderLote()` — lote abierto no se actualiza desde otro dispositivo sin cambiar de pestaña.

### 5. Performance Firestore
`pullLotes` descarga todos los lotes al iniciar — evaluar paginación o filtro por fecha cuando haya muchos lotes.

### 6. Setup documentado para cliente nuevo
Guía paso a paso: crear Firebase project, configurar Firestore rules, deployar para cliente nuevo. Necesario antes de primera venta.

---

## §7 Producto y negocio

**Visión:** SGC digital para PyMEs industriales con ISO 9001
**Modelo:** Consultoría — licencia perpetua + soporte mensual opcional
**Cliente:** PyME industrial 20-200 empleados, certificada o en proceso ISO 9001
**Contacto de venta:** Coordinador/a de Calidad o Gerente de Planta

**Precio orientativo:**
- Licencia: $800.000–$1.500.000 ARS
- Implementación: $300.000–$500.000 ARS
- Soporte mensual opcional: $80.000–$150.000 ARS

**Antes de primera venta necesitás:**
1. Firmar acuerdo de licencia con Agrofacil
2. Panel admin funcional (config sin tocar código)
3. Setup documentado para cliente nuevo

**Archivos generados:**
- `ARQUITECTURA_QualityOS.md`
- `QualityOS_Acuerdo_Uso.md`
- `QualityOS_Plan_Producto_Negocio.md`

---

## §8 Identidad visual

- **Dark mode:** fondo `#111827` / `#1a1a2e`
- **Primario teal:** `#2a6a6a` (bordes, headers de tabla, botones)
- **Acento verde:** `#00C896` (logo Q, badges OK)
- **Tipografía mono:** datos numéricos y códigos
- **Assets:** `qualityos-topbar.svg`, `qualityos-logo.svg`, `qualityos-icon.svg`, `logo-transparent.png`
- **Diseños v2:** proyecto Claude Design en `claude.ai/design/p/cf96b95b-f2af-4888-bb04-46f0d9468f07`

---

_Para retomar: subí este archivo en chat nuevo de Claude y continuamos desde §6 Pendiente_
