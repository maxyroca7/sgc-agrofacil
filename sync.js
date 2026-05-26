// ════════════════════════════════════════════
//  SGC Agrofacil — sync.js  v1.0
//  Capa de sincronización: localStorage + IndexedDB → Firestore
//  Offline-first: si no hay red, Firestore encola y sincroniza solo
// ════════════════════════════════════════════

import { db } from './firebase-init.js';
import {
  collection, doc, setDoc, getDocs, onSnapshot, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ─── Colecciones Firestore ────────────────
const COL_LOTES = 'lotes';
const COL_NC    = 'nc_records';

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
  if (!lote?.id) return;
  try {
    await setDoc(doc(db, COL_LOTES, String(lote.id)), {
      ...lote,
      _ts: Date.now()
    });
  } catch (e) {
    console.warn('[sync] pushLote error:', e.message);
  }
}

/** Eliminar lote de Firestore al liberar/eliminar */
export async function deleteLote(loteId) {
  try {
    await deleteDoc(doc(db, COL_LOTES, String(loteId)));
  } catch (e) {
    console.warn('[sync] deleteLote error:', e.message);
  }
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
//  NC RECORDS  (Registro NC ↔ Firestore)
// ════════════════════════════════════════

/** Push: escribe un NC record en Firestore */
export async function pushNC(nc) {
  if (!nc?.id) return;
  try {
    await setDoc(doc(db, COL_NC, String(nc.id)), {
      ...nc,
      _ts: Date.now()
    });
  } catch (e) {
    console.warn('[sync] pushNC error:', e.message);
  }
}

/** Pull: trae todos los NC records de Firestore */
export async function pullNC() {
  try {
    const snap = await getDocs(collection(db, COL_NC));
    const records = [];
    snap.forEach(d => records.push(d.data()));
    return records;
  } catch (e) {
    console.warn('[sync] pullNC error:', e.message);
    return [];
  }
}

/** Listener en tiempo real para NC */
export function escucharNC(onCambio) {
  return onSnapshot(collection(db, COL_NC), (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === 'added' || change.type === 'modified') {
        if (onCambio) onCambio(change.doc.data());
      }
    });
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

/** Parche IndexedDB — detecta escrituras en store "nc_records" */
;(function patchIDB() {
  const _put = IDBObjectStore.prototype.put;
  const _add = IDBObjectStore.prototype.add;

  function intercept(store, value) {
    if (store.name === 'nc_records' && value && typeof value === 'object') {
      pushNC(value);
    }
  }

  IDBObjectStore.prototype.put = function (value, key) {
    intercept(this, value);
    return _put.call(this, value, key);
  };

  IDBObjectStore.prototype.add = function (value, key) {
    intercept(this, value);
    return _add.call(this, value, key);
  };

  console.log('[sync] IndexedDB parcheado para store: nc_records');
})();

console.log('[sync] Capa de sincronización activa — SGC Agrofacil v1');
