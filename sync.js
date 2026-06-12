// ════════════════════════════════════════════
//  SGC Agrofacil — sync.js  v1.1
//  Capa de sincronización: localStorage + IndexedDB → Firestore
//  Offline-first: si no hay red, Firestore encola y sincroniza solo
//  v1.1 (11/06/2026): NCs unificadas al doc único nc/registro.
//    - pushNC/pullNC/escucharNC ahora operan sobre nc/registro {rows[], _ts}
//    - Eliminado parche IndexedDB (apuntaba a store inexistente "nc_records";
//      registro_nc.html ya sincroniza por su cuenta contra nc/registro)
//    - Colección nc_records DESCONTINUADA (queda huérfana en Firestore;
//      se puede borrar manualmente desde Console cuando quieras)
// ════════════════════════════════════════════

import { db } from './firebase-init.js';
import {
  collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ─── Referencias Firestore ────────────────
const COL_LOTES = 'lotes';
const NC_DOC    = () => doc(db, 'nc', 'registro');   // doc único con rows[]

// ─── Key localStorage de lotes ───────────
// ⚠️  Verificar que coincida con el valor en cargarLotes() / guardarLotes()
//     de REG01_planilla_digital.html
const LS_KEY = 'reg01_lotes_v3';

// ════════════════════════════════════════
//  LOTES  (REG-01 ↔ Firestore)
// ════════════════════════════════════════

/** Pull: trae lotes de Firestore y los fusiona en localStorage */
export async function pullLotes() {
  try {
    const snap = await getDocs(collection(db, COL_LOTES));
    if (snap.empty) return;

    const remotos = {};
    snap.forEach(d => { remotos[d.id] = d.data(); });

    const raw     = localStorage.getItem(LS_KEY);
    const locales = raw ? JSON.parse(raw) : [];
    const mapa    = {};
    locales.forEach(l => { mapa[l.id] = l; });

    // Remoto gana si tiene timestamp más nuevo
    Object.entries(remotos).forEach(([id, r]) => {
      if (!mapa[id] || (r._ts && (!mapa[id]._ts || r._ts > mapa[id]._ts))) {
        mapa[id] = r;
      }
    });

    // Guardar sin disparar el parche (usar key interno)
    _setRaw(LS_KEY, JSON.stringify(Object.values(mapa)));
    console.log('[sync] pullLotes OK —', Object.keys(mapa).length, 'lotes');
  } catch (e) {
    console.warn('[sync] pullLotes error:', e.message);
  }
}

/** Push: escribe un lote en Firestore */
export async function pushLote(lote) {
  console.log('[sync] pushLote llamado, id:', lote?.id);
  if (!lote?.id) { console.warn('[sync] pushLote abortado: lote sin id', lote); return; }
  try {
    await setDoc(doc(db, COL_LOTES, String(lote.id)), {
      ...lote,
      _ts: Date.now()
    });
  } catch (e) {
    console.warn('[sync] pushLote error:', e.message);
  }
}

/** Eliminar lote de Firestore. Lanza el error para que el llamador pueda manejarlo. */
export async function deleteLote(loteId) {
  await deleteDoc(doc(db, COL_LOTES, String(loteId)));
}

/** Listener en tiempo real: actualiza localStorage cuando otro dispositivo cambia un lote */
export function escucharLotes(onCambio) {
  return onSnapshot(collection(db, COL_LOTES), (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === 'added' || change.type === 'modified') {
        const lote = change.doc.data();
        const raw  = localStorage.getItem(LS_KEY);
        const arr  = raw ? JSON.parse(raw) : [];
        const idx  = arr.findIndex(l => l.id === lote.id);
        if (idx >= 0) arr[idx] = lote; else arr.push(lote);
        _setRaw(LS_KEY, JSON.stringify(arr));
        if (onCambio) onCambio(lote);
      }
    });
  });
}

// ════════════════════════════════════════
//  NC  (Registro NC ↔ Firestore)
//  Fuente de verdad: documento único nc/registro → { rows: [...], _ts }
//  (mismo esquema que usa registro_nc.html)
// ════════════════════════════════════════

/** Push: escribe el array COMPLETO de NCs en nc/registro.
 *  Reemplaza el documento entero a propósito (sin merge):
 *  rows[] siempre se sube completo. */
export async function pushNC(rows) {
  if (!Array.isArray(rows)) {
    console.warn('[sync] pushNC abortado: se esperaba un array de rows', rows);
    return;
  }
  try {
    await setDoc(NC_DOC(), { rows, _ts: Date.now() });
    console.log('[sync] pushNC OK —', rows.length, 'NCs');
  } catch (e) {
    console.warn('[sync] pushNC error:', e.message);
  }
}

/** Pull: trae el array de NCs desde nc/registro. Devuelve [] si no existe. */
export async function pullNC() {
  try {
    const snap = await getDoc(NC_DOC());
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data.rows) ? data.rows : [];
  } catch (e) {
    console.warn('[sync] pullNC error:', e.message);
    return [];
  }
}

/** Listener en tiempo real sobre nc/registro.
 *  onCambio recibe el array rows[] completo cada vez que cambia. */
export function escucharNC(onCambio) {
  return onSnapshot(NC_DOC(), (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    if (onCambio) onCambio(Array.isArray(data.rows) ? data.rows : []);
  });
}

// ════════════════════════════════════════
//  PARCHES  (interceptores automáticos)
// ════════════════════════════════════════

// Referencia al setItem original (sin parche)
const _setRaw = localStorage.setItem.bind(localStorage);

/** Parche localStorage — detecta guardarLotes() automáticamente */
;(function patchLocalStorage() {
  localStorage.setItem = function (key, value) {
    _setRaw(key, value);
    if (key === LS_KEY) {
      try {
        const lotes = JSON.parse(value);
        if (Array.isArray(lotes)) {
          lotes.forEach(l => pushLote(l));
        }
      } catch {}
    }
  };
  console.log('[sync] localStorage parcheado para key:', LS_KEY);
})();

// NOTA v1.1: se eliminó el parche de IndexedDB.
// Interceptaba un store llamado "nc_records" que no existe
// (el store real es agrofacil_nc_v6 → "data", key "rows"),
// por lo que nunca se ejecutó. registro_nc.html sincroniza
// directamente contra nc/registro, así que no hace falta.

console.log('[sync] Capa de sincronización activa — SGC Agrofacil v1.1');
