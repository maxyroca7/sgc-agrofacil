# SGC Agrofacil — Sistema de Gestión de Calidad Digital

Sistema de gestión de calidad industrial para Agrofacil S.A. (planta Ezeiza), implementado como Progressive Web App (PWA).

**URL de producción:** [sgc-agrofacil.web.app](https://sgc-agrofacil.web.app)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 / CSS3 / JavaScript vanilla |
| Auth | Firebase Authentication |
| Base de datos | Cloud Firestore (con persistencia local offline) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions → deploy automático en push a `main` |
| PWA | Service Worker v18 (network-first HTML, cache-first assets) |

---

## Módulos del sistema

### REG-01 Digital (`REG01_planilla_digital.html`)
Registro digital de control de proceso en línea de envasado.
- Control de inductoras (A–E) con tolerancias configurables
- Carga de pallets por lote con peso y resultado
- Dictamen de lote (Aprobado / Aprobado Parcial / Retenido)
- Generación de NC desde el mismo formulario
- Exportación a Excel compatible con Power BI

### Registro de NCs (`registro_nc.html`)
Registro y seguimiento de No Conformidades.
- Campos: lote, producto, tipo de desvío, gravedad, detección, acción, responsable
- KPIs automáticos: AQ-IND-01 al AQ-IND-06
- Exportación a Excel e impresión PDF
- Sincronización con Firestore

### Historial (`historial.html`)
Consulta de lotes por cliente y período.
- Vista por cliente (carpetas) y vista general
- Estadísticas: total, aprobados, parciales, retenidos
- Impresión PDF por lote

---

## Estructura del repositorio

```
sgc-agrofacil/
├── index.html              # Redirect a login
├── login.html              # Autenticación Firebase
├── home.html               # Dashboard principal
├── REG01_planilla_digital.html
├── registro_nc.html
├── historial.html
├── firebase-init.js        # Config Firebase compartida
├── sync.js                 # Sincronización Firestore ↔ localStorage
├── sw.js                   # Service Worker v18
├── manifest.json           # PWA manifest
└── .github/
    └── workflows/
        └── firebase-hosting.yml  # Deploy automático
```

---

## Colecciones Firestore

| Colección | Campos principales |
|-----------|-------------------|
| `lotes` | nLote, producto, cliente, dictamen, pallets[], checker, turno, fechaCreacion, pesoMin, pesoMax |
| `nc_records` | nLote, tipoDesvio, gravedad, estado, fechaDeteccion, responsable, eficacia |

---

## Almacenamiento local

| Clave | Contenido |
|-------|-----------|
| `reg01_lotes_v3` | Lotes activos REG-01 (localStorage) |
| `agrofacil_nc_v6` | NCs (IndexedDB principal) |
| `reg01_nc_pendientes` | Bridge REG-01 → registro_nc |
| `reg01_cfg_v1` | Config inductoras |
| `theme` | Preferencia dark/light |

---

## Configuración de accesos

Los usuarios se administran desde **Firebase Console → Authentication**.  
Roles actuales:
- `checker` — acceso completo
- `coordinadora` — lectura + dictamen (en desarrollo)

---

## Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/maxyroca7/sgc-agrofacil
cd sgc-agrofacil

# Abrir Claude Code
claude

# Deploy manual (si no se usa GitHub Actions)
firebase deploy --only hosting
```

**Deploy automático:** cualquier push a `main` dispara el workflow de GitHub Actions y despliega a Firebase Hosting en ~1 minuto.

---

## Contacto

Desarrollado por Maxi Roca — Checker de Calidad, Agrofacil S.A.  
Ezeiza, Buenos Aires, Argentina.
