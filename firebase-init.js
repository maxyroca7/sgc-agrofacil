// ════════════════════════════════════════════
//  SGC Agrofacil — firebase-init.js  v1.0
//  Inicialización compartida: Auth + Firestore
// ════════════════════════════════════════════

import { initializeApp }        from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
                                 from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, getDoc, doc }
                                 from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ─── Config ───────────────────────────────
export const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDHDOmhtDFGXDGzyCFo_5wDgJwwBYnDlO4",
  authDomain:        "sgc-agrofacil.firebaseapp.com",
  projectId:         "sgc-agrofacil",
  storageBucket:     "sgc-agrofacil.firebasestorage.app",
  messagingSenderId: "1038454261227",
  appId:             "1:1038454261227:web:40bd20ded74530aac7c5ae"
};

// ─── Init ─────────────────────────────────
const app = initializeApp(FIREBASE_CONFIG);

export const auth = getAuth(app);

// Firestore con persistencia offline (IndexedDB interno de Firebase)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// ─── Auth Guard ───────────────────────────
// Llama a esto en cada página protegida.
// rolesPermitidos (opcional): si se provee, verifica que el rol del usuario esté incluido.
// Si el rol no está en la lista → redirige a home.html sin mostrar contenido.
export function authGuard(rolesPermitidos = []) {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.replace('./login.html');
        return;
      }
      const el = document.getElementById('checker-email');
      if (el) el.textContent = user.email.split('@')[0];
      if (rolesPermitidos.length > 0) {
        const rol = await getRol(user.uid);
        if (!rolesPermitidos.includes(rol)) {
          window.location.replace('./home.html');
          return;
        }
      }
      resolve(user);
    });
  });
}

// ─── Rol ──────────────────────────────────
export async function getRol(uid) {
  try {
    const snap = await getDoc(doc(db, 'usuarios', uid));
    const rol = snap.exists() ? (snap.data().rol || 'checker') : 'checker';
    console.log('[getRol] uid:', uid, '| doc exists:', snap.exists(), '| data:', snap.exists() ? JSON.stringify(snap.data()) : 'N/A', '| rol resuelto:', rol);
    return rol;
  } catch (e) {
    console.error('[getRol] Error leyendo Firestore:', e);
    return 'checker';
  }
}

// ─── Logout ───────────────────────────────
export async function cerrarSesion() {
  await signOut(auth);
  window.location.replace('./login.html');
}
