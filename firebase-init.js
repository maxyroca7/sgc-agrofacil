// ════════════════════════════════════════════
//  SGC Agrofacil — firebase-init.js  v1.0
//  Inicialización compartida: Auth + Firestore
// ════════════════════════════════════════════

import { initializeApp }        from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
                                 from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { initializeFirestore, persistentLocalCache }
                                 from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ─── Config ───────────────────────────────
const FIREBASE_CONFIG = {
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
// Si no hay sesión activa → redirige a login.html
export function authGuard() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        // Mostrar email del checker en topbar si existe el elemento
        const el = document.getElementById('checker-email');
        if (el) el.textContent = user.email.split('@')[0];
        resolve(user);
      } else {
        window.location.replace('./login.html');
      }
    });
  });
}

// ─── Logout ───────────────────────────────
export async function cerrarSesion() {
  await signOut(auth);
  window.location.replace('./login.html');
}
