// Tabla central de roles → módulos
// 'coordinadora' en el array indica re-ruteo del card reg01 → coordinadora.html
export const ROLES_CONFIG = {
  checker:        ['reg01', 'registro_nc'],
  coordinadora:   ['reg01', 'historial', 'coordinadora', 'capa', 'dashboard'],
  administrativa: ['registro_nc'],
  desarrollador:  ['reg01', 'registro_nc', 'historial', 'coordinadora', 'admin', 'capa', 'dashboard'],
};
