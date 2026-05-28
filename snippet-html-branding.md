# Branding QualityOS — Snippets de implementación HTML
# Aplicar en TODOS los archivos HTML del repo
# Mayo 2026

---

## 1. `<head>` — Reemplazar favicon existente

Buscar cualquier `<link rel="icon"...>` existente y reemplazar por:

```html
<link rel="icon"             type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon"                               href="/apple-touch-icon.png">
```

---

## 2. Topbar — Reemplazar bloque `.tb-brand`

Buscar el bloque `<div class="tb-brand">` (o similar) y reemplazarlo por:

```html
<div class="tb-brand">
  <img src="/topbar-icon.svg"
       alt="QualityOS"
       class="tb-logo"
       width="28" height="28">
  <span class="tb-appname">QualityOS</span>
</div>
```

> Nota: si el topbar usa un `<a>` envolvente, mantenerlo. Ejemplo:
> `<a class="tb-brand" href="/index.html"> ... </a>`

---

## 3. CSS — Agregar al bloque `<style>` existente

```css
/* ── Branding topbar ── */
.tb-logo    { display: block; flex-shrink: 0; }
.tb-appname {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--accent);
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Footer global ── */
.app-footer {
  margin-top: auto;
  padding: 1.1rem 1rem 0.9rem;
  text-align: center;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.70rem;
  letter-spacing: 0.04em;
  user-select: none;
}
.footer-dot { margin: 0 0.45em; opacity: 0.35; }
```

---

## 4. Footer — Pegar justo antes de `</body>`

```html
<footer class="app-footer">
  <span>Desarrollado por Maximiliano Roca</span>
  <span class="footer-dot">·</span>
  <span>QualityOS v1.0</span>
  <span class="footer-dot">·</span>
  <span>Agrofacil S.A.</span>
</footer>
```

---

## 5. manifest.json — Reemplazar array `"icons"`

```json
"icons": [
  {
    "src": "/favicon-32.png",
    "sizes": "32x32",
    "type": "image/png"
  },
  {
    "src": "/icon-192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "/icon-512.png",
    "sizes": "512x512",
    "type": "image/png"
  },
  {
    "src": "/icon-maskable-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  },
  {
    "src": "/apple-touch-icon.png",
    "sizes": "180x180",
    "type": "image/png"
  }
]
```

---

## Checklist por archivo HTML

- [ ] `index.html`
- [ ] `reg01.html`
- [ ] `nc.html`
- [ ] `historial.html`
- [ ] `admin.html` (si existe)

Para cada uno: ✅ favicon · ✅ tb-brand · ✅ CSS · ✅ footer

## manifest.json
- [ ] Actualizar array icons

