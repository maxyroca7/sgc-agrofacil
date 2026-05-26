# Manual de Usuario — SGC Digital Agrofacil

_Sistema de Gestión de Calidad — Planta Ezeiza_  
_Versión: Mayo 2026_

---

## Acceso al sistema

1. Abrir el navegador (Chrome o Edge) en el celular o PC
2. Ingresar a: **sgc-agrofacil.web.app**
3. Escribir el email y contraseña asignados
4. Tocar **Ingresar**

> 💡 **Tip:** Podés instalar la app en tu celu tocando el botón "Instalar" en la pantalla de login. Así la encontrás como ícono en tu pantalla de inicio, sin abrir el navegador.

---

## Pantalla de inicio (Home)

Al ingresar verás el menú principal con acceso a los tres módulos:

| Módulo | Para qué sirve |
|--------|---------------|
| **REG-01 Digital** | Registrar control de proceso turno a turno |
| **Registro de NCs** | Cargar y hacer seguimiento de No Conformidades |
| **Historial** | Consultar lotes por cliente o período |

En el topbar (barra superior) encontrás el botón 🌙/☀️ para cambiar entre modo oscuro y claro.

---

## Módulo REG-01 Digital

### Crear un nuevo lote

1. Tocar **+ Lote** en el topbar
2. Completar los datos del lote:
   - **Producto** — nombre del producto
   - **N° de Lote** — número de lote según ISIS ERP
   - **Cliente** — cliente destino
   - **Línea** — línea de producción (Ej: Env-04)
   - **Fecha** — se completa automáticamente
   - **Inductora** — seleccionar la inductora activa (A, B, C, D o E)
3. Cargar pallets uno por uno con su peso y resultado
4. Tocar **Guardar** para guardar el avance

### Dictaminar un lote

Una vez completado el control:

1. Tocar **Dictaminar**
2. Seleccionar el resultado:
   - ✅ **Aprobado** — lote conforme
   - ⚠️ **Aprobado Parcial** — con observaciones
   - 🔴 **Retenido** — no conforme, requiere acción
3. Confirmar el dictamen

### Generar una NC desde REG-01

Si detectás una no conformidad durante el control:

1. Tocar **Generar NC**
2. El sistema lleva los datos del lote al formulario de NCs automáticamente
3. Completar los campos adicionales de la NC

### Configurar tolerancias de inductoras

1. Tocar el ícono ⚙️ en el topbar
2. Modificar los valores de referencia y tolerancia para cada inductora
3. Guardar — los cambios se aplican a todos los registros nuevos

### Exportar a Excel

1. Tocar **↓ Descargar Excel** en el toolbar
2. El archivo descarga en formato .xlsx compatible con Power BI

---

## Módulo Registro de NCs

### Cargar una nueva NC

1. Ir a **Registro de NCs** desde el Home
2. Tocar **+ Agregar fila**
3. Completar los campos:

| Campo | Descripción |
|-------|-------------|
| **Fecha** | Fecha de detección (se completa automáticamente) |
| **N° Lote** | Número de lote afectado |
| **Producto** | Nombre del producto |
| **Tipo de desvío** | Categoría del problema |
| **Gravedad** | Leve / Moderado / Crítico |
| **Detección** | Cómo y dónde se detectó |
| **Descripción** | Detalle del problema |
| **Litros NC** | Litros no conformes |
| **Litros Totales** | Litros del lote total |
| **Acción** | Acción correctiva tomada |
| **Plazo** | Fecha límite de resolución |
| **Estado** | Pendiente / En curso / Finalizado |
| **Responsable** | Persona a cargo de la acción |
| **Verif. Eficacia** | Resultado de verificación |

4. Los datos se guardan automáticamente

### Indicadores KPI (panel superior)

El sistema calcula automáticamente 6 indicadores:

| Indicador | Qué mide |
|-----------|---------|
| **AQ-IND-01** | NC totales del período |
| **AQ-IND-02** | Tasa de litros NC (meta: < 5%) |
| **AQ-IND-03** | Tipo de desvío más frecuente |
| **AQ-IND-04** | Reprocesos resueltos en plazo (meta: > 90%) |
| **AQ-IND-05** | Pallets pendientes de reproceso |
| **AQ-IND-06** | Carga de trabajo estimada en horas |

### Imprimir / Exportar NCs

- **Imprimir / PDF** — genera un documento PDF con el registro del mes
- **↓ Descargar Excel** — exporta las NCs a planilla .xlsx
- **⚙️ Codificación** — configura opciones del documento

---

## Módulo Historial

### Consultar lotes por cliente

1. Ir a **Historial** desde el Home
2. Por defecto se muestra la vista **Por Cliente** (carpetas)
3. Buscar el cliente en el campo de búsqueda
4. Tocar la carpeta del cliente para ver sus lotes

### Ver todos los lotes

1. Tocar **Todos los lotes** en el selector de vista
2. Se listan todos los lotes del período con su dictamen

### Imprimir un lote

1. Abrir el lote deseado
2. Tocar el botón de imprimir (🖨️)
3. Se abre una ventana de impresión con el formato del documento

---

## Uso offline (sin internet)

La app funciona sin conexión a internet para:
- ✅ Cargar datos de lotes y pallets
- ✅ Registrar NCs
- ✅ Consultar datos ya cargados

Cuando se recupera la conexión, los datos se sincronizan automáticamente con la nube.

> ⚠️ **Importante:** Para ver datos cargados por otros usuarios (otros turnos) necesitás conexión a internet.

---

## Cambio de tema (modo oscuro / claro)

- Tocar el ícono 🌙 para cambiar a modo claro ☀️
- La preferencia se guarda y se aplica en todas las páginas

---

## Cierre de sesión

- Tocar el botón **🚪 Salir** en el topbar de cualquier página
- Por seguridad, cerrá siempre la sesión al terminar el turno si usás un dispositivo compartido

---

## Solución de problemas frecuentes

| Problema | Solución |
|---------|---------|
| "No puedo iniciar sesión" | Verificar email y contraseña. Contactar al administrador si es nuevo usuario |
| "Los datos no aparecen" | Verificar conexión a internet y recargar la página |
| "El lote no se sincronizó" | La sincronización es automática. Verificar conexión y esperar unos segundos |
| "La app no carga" | Limpiar caché del navegador (Configuración → Privacidad → Limpiar datos) |
| "Instalé la app pero no abre" | Desinstalar y reinstalar desde sgc-agrofacil.web.app |

---

## Contacto y soporte

Para consultas técnicas o accesos, comunicarse con:  
**Maxi Roca** — Área de Calidad, Agrofacil S.A.
