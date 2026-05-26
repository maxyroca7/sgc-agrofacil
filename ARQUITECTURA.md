# Arquitectura Técnica — SGC Digital Agrofacil

_Documento para el equipo de Sistemas_  
_Versión: Mayo 2026_

---

## Diagrama general

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO FINAL                     │
│         (Chrome / Edge — celu o PC en planta)       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              Firebase Hosting (CDN)                 │
│         sgc-agrofacil.web.app                       │
│   HTML · CSS · JS · sw.js (Service Worker)          │
└──────────┬─────────────────────┬────────────────────┘
           │                     │
┌──────────▼──────────┐ ┌───────▼────────────────────┐
│  Firebase Auth      │ │  Cloud Firestore            │
│  (email/password)   │ │  Colecciones:               │
│                     │ │  · lotes                    │
└─────────────────────┘ │  · nc_records               │
                        └────────────────────────────┘
```

---

## Flujo de datos

### 1. Autenticación
1. Usuario ingresa email + contraseña en `login.html`
2. Firebase Auth valida credenciales
3. `authGuard()` en cada página protegida verifica sesión activa
4. Si no hay sesión → redirige a `login.html`

### 2. Registro REG-01
```
Usuario carga datos del lote
    → Guardado en localStorage (reg01_lotes_v3) — disponible offline
    → sync.js sincroniza con Firestore (colección: lotes) cuando hay conexión
    → Si genera NC → puente via reg01_nc_pendientes → registro_nc
```

### 3. Registro de NCs
```
Checker completa formulario NC
    → Guardado en IndexedDB (agrofacil_nc_v6) — disponible offline
    → sync.js sincroniza con Firestore (colección: nc_records)
    → KPIs se calculan on-the-fly desde los datos locales
```

### 4. Historial / Consulta
```
Coordinadora o checker abre historial.html
    → authGuard() verifica sesión
    → Carga lotes desde Firestore (en tiempo real)
    → Permite filtrar por cliente, período, dictamen
    → Genera PDF via window.print()
```

---

## Service Worker (sw.js v18)

Estrategia de caché por tipo de recurso:

| Recurso | Estrategia |
|---------|-----------|
| HTML (`.html`) | Network-first → garantiza actualizaciones automáticas |
| JS / CSS / imágenes | Cache-first → carga rápida, sin re-descarga |
| Firebase APIs | Network-only → siempre datos frescos |

**Resultado:** la app funciona offline para carga de datos; sincroniza cuando recupera conexión.

---

## CI/CD — Deploy automático

```
Desarrollador hace git push a main (GitHub)
    → GitHub Actions dispara .github/workflows/firebase-hosting.yml
    → Build (no hay compilación — archivos estáticos)
    → firebase deploy --only hosting
    → CDN actualizado en ~60 segundos
    → Service Worker v18 invalida caché anterior en próxima visita
```

---

## Seguridad

| Aspecto | Implementación |
|---------|---------------|
| Autenticación | Firebase Auth (email + contraseña) |
| Reglas Firestore | Lectura/escritura solo para usuarios autenticados |
| HTTPS | Obligatorio — Firebase Hosting lo fuerza |
| Datos locales | Solo en el dispositivo del usuario (no expuestos) |
| Sin backend propio | No hay servidor de aplicaciones — reduce superficie de ataque |

---

## Requisitos del cliente

| Requisito | Detalle |
|-----------|---------|
| Navegador | Chrome 90+ o Edge 90+ (para soporte PWA e IndexedDB) |
| Conexión | Recomendada para sincronización; offline funciona para carga |
| Dispositivo | Celu o PC con pantalla ≥ 360px de ancho |
| Instalación | Sin instalación — PWA instalable desde el browser si se desea |

---

## Variables de entorno / Configuración sensible

La configuración de Firebase está en `firebase-init.js`. Las claves son **públicas por diseño** en Firebase (el acceso real se controla con las reglas de Firestore y Firebase Auth, no con las claves del SDK).

No se usan variables de entorno del servidor ni archivos `.env`.

---

## Escalabilidad y limitaciones conocidas

- **Firestore:** plan Spark (gratuito) — límites: 50K lecturas/día, 20K escrituras/día. Suficiente para uso en una planta con <10 usuarios.
- **Bug conocido:** fusión de NCs simultáneas en IndexedDB puede generar conflictos si dos checkers registran al mismo tiempo desde el mismo lote. En evaluación.
- **Roles:** el sistema de roles (checker / coordinadora) está implementado a nivel UI; falta reforzar con Firebase custom claims.
