// Valores por defecto del objeto cfg de inductoras y metadatos de documento.
// Compartido entre REG01, coordinadora e historial.
export const CFG_DEFAULT = {
  inductoras: [
    {id:'A', nombre:'DCGY-F200',  ref:1.2, tolMin:1.0, tolMax:1.4, unidad:''},
    {id:'B', nombre:'SKYM',       ref:1.2, tolMin:1.0, tolMax:1.4, unidad:''},
    {id:'C', nombre:'ENERCON',    ref:1.2, tolMin:1.0, tolMax:1.4, unidad:''},
    {id:'D', nombre:'INDUSMACH',  ref:1.2, tolMin:1.0, tolMax:1.4, unidad:''},
    {id:'E', nombre:'LB-6000J',   ref:1.2, tolMin:1.0, tolMax:1.4, unidad:''},
  ],
  claveCoord: '1234',
  docCodigo:  'SGC-REG01-APP',
  docVersion: '00',
  docElab:    'Maximiliano Roca',
  docAprob:   'Evelin Alcaraz',
}

// Fusiona los datos de EMPRESA_CFG (Firestore config/empresa) en el objeto cfg.
// Pura: muta cfg y lo retorna.
export function aplicarEmpresaCfg(cfg, empresaCfg) {
  const e = empresaCfg || {}
  if (e.inductoras && e.inductoras.length > 0) cfg.inductoras = e.inductoras
  if (e.claveCoord)  cfg.claveCoord = e.claveCoord
  if (e.sgc)         cfg.docCodigo  = e.sgc
  if (e.version)     cfg.docVersion = e.version
  if (e.elaborador)  cfg.docElab    = e.elaborador
  if (e.aprobador)   cfg.docAprob   = e.aprobador
  return cfg
}
