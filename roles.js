// Tabla central de roles → módulos.
// La matriz EDITABLE vive en Firestore: config/empresa.rolesModulos
// (se administra desde admin.html, sección "Módulos por rol").
// DEFAULT_ROLES_CONFIG es el fallback si Firestore aún no tiene la matriz.
//
// Módulos: reg01 · registro_nc · historial · coordinacion · admin · capa · dashboard
// Nota: el módulo 'coordinacion' (panel coordinadora.html) no se asigna por defecto
// al rol coordinadora porque su card de REG01 ya se re-rutea a ese panel desde home.

export const DEFAULT_ROLES_CONFIG = {
  checker:        ['reg01', 'registro_nc'],
  coordinadora:   ['reg01', 'registro_nc', 'historial', 'capa', 'dashboard'],
  administrativa: ['registro_nc', 'historial'],
  desarrollador:  ['reg01', 'registro_nc', 'historial', 'coordinacion', 'admin', 'capa', 'dashboard'],
};

// Compatibilidad: código existente que importe ROLES_CONFIG sigue funcionando.
export const ROLES_CONFIG = DEFAULT_ROLES_CONFIG;

// Devuelve la config efectiva: la matriz de Firestore si existe, sino los defaults.
// Merge por rol: si un rol no está definido en remoto, usa su default.
export function getRolesConfig(empresaCfg) {
  const remoto = empresaCfg?.rolesModulos;
  if (remoto && typeof remoto === 'object' && !Array.isArray(remoto)) {
    return { ...DEFAULT_ROLES_CONFIG, ...remoto };
  }
  return DEFAULT_ROLES_CONFIG;
}
