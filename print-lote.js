// Generación de PDF de lote. Compartido entre REG01, coordinadora e historial.
// Todas las funciones son puras: reciben sus datos como parámetros, sin globals.

// Retorna clase CSS de semáforo ('ok'|'warn'|'nok'|'').
// Aplica color SOLO si ind.semaforo === true en cfg.inductoras.
export function semaforo(val, indId, inductoras) {
  const ind = inductoras.find(i => i.id === indId)
  if (!ind || !ind.semaforo) return ''
  if (val === '' || val === null || val === undefined) return ''
  const v = parseFloat(val); if (isNaN(v)) return ''
  if (v >= ind.tolMin && v <= ind.tolMax) return 'ok'
  const m = (ind.tolMax - ind.tolMin) * 0.3
  if (v >= ind.tolMin - m && v <= ind.tolMax + m) return 'warn'
  return 'nok'
}

export function _cfHasNakedNOK(p) {
  return (p.idOK===false&&!p.idRepro)||(p.qrOK===false&&!p.qrRepro)||
         (p.paletOK===false&&!p.paletRepro)||(p.indCFOK===false&&!p.indCFRepro)
}

export function _cfHasAnyRepro(p) {
  return !!(p.idRepro||p.qrRepro||p.paletRepro||p.indCFRepro)
}

// Construye el HTML del cuerpo del PDF para un lote.
// cfg debe tener: { inductoras[], docCodigo, docVersion, docElab, docAprob }
export function buildPrintBody(l, cfg) {
  const ind=cfg.inductoras.find(x=>x.id===l.cab.indId)||{nombre:'—',tolMin:null,tolMax:null,unidad:''};
  const indLbl=ind.nombre+(ind.unidad?' ('+ind.unidad+')':'');
  const rango=ind.tolMin!=null?ind.tolMin+'–'+ind.tolMax+(ind.unidad?' '+ind.unidad:''):'—';
  const _st=(ok,repro)=>{
    if(repro)      return '<b style="color:#b45309">&#8635; REPRO</b>';
    if(ok===false) return '<b style="color:#b91c1c">&#10007; NOK</b>';
    if(ok===true)  return '<b style="color:#166534">&#10003; OK</b>';
    return '<span style="color:#888">&#8212;</span>';
  };
  const cab=l.cab;
  const cabHtml=`
  <div class="card" style="margin-bottom:8px;border:1px solid #ccc">
    <div style="background:#f0f0f0;color:#000;padding:5px 10px;font-weight:700;font-size:10px;border-bottom:1px solid #ccc">
      Datos del lote
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:8px;font-family:Arial,sans-serif">
      <tr>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700;width:100px">Producto</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.prod||'—'}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700;width:100px">N° de Lote</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.lote||'—'}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700;width:80px">Cliente</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.cliente||'—'}</td>
      </tr>
      <tr>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Línea</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.linea||'—'}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Inductora</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${indLbl}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Rango ind.</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${rango}</td>
      </tr>
      <tr>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Peso mín. pico</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.pesoMin?cab.pesoMin+' kg':'—'}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Peso máx. pico</td>
        <td style="padding:3px 6px;border:1px solid #ddd">${cab.pesoMax?cab.pesoMax+' kg':'—'}</td>
        <td style="padding:3px 6px;border:1px solid #ddd;background:#f7f7f7;font-weight:700">Estado</td>
        <td style="padding:3px 6px;border:1px solid #ddd;font-weight:700">${l.estado.toUpperCase()}</td>
      </tr>
    </table>
  </div>`;
  const clRows=l.linea.map((p,i)=>{
    const s=semaforo(p.indVal,l.cab.indId,cfg.inductoras);
    const _hasNOK=(p.indOK===false&&!p.repro)||(p.qrLineaOK===false&&!p.qrRepro)||(p.packOK===false&&!p.packRepro)||(p.pltOK===false&&!p.pltRepro);
    const _hasRepro=p.repro||p.qrRepro||p.packRepro||p.pltRepro;
    const rowStyle=_hasNOK?'background:rgba(239,68,68,.07)':_hasRepro?'background:rgba(251,146,60,.07)':'';
    const vacio=!p.fecha&&!p.hora&&!p.lote&&p.indOK===null?'pal-vacio':'';
    return `<tr class="${vacio}" style="${rowStyle}">
      <td class="n">${i+1}</td>
      <td>${p.nPal||''}</td>
      <td>${p.fecha||''}</td>
      <td>${p.hora||''}</td>
      <td>${p.p1||''}</td><td>${p.p2||''}</td><td>${p.p3||''}</td><td>${p.p4||''}</td>
      <td>${p.lote||''}</td>
      <td>${p.codProd||''}</td>
      <td>${p.fProd||''}</td>
      <td>${p.fVenc||''}</td>
      <td style="text-align:center">${_st(p.indOK,p.repro)}</td>
      <td style="text-align:center">
        <div class="ind-cell" style="justify-content:center">
          <span style="font-family:var(--mono)">${p.indVal||'—'}</span>
          <div class="sem ${s}"></div>
        </div>
      </td>
      <td style="text-align:center">${_st(p.qrLineaOK,p.qrRepro)}</td>
      <td style="text-align:center">${_st(p.packOK,p.packRepro)}</td>
      <td style="text-align:center">${_st(p.pltOK,p.pltRepro)}</td>
    </tr>
    ${p.obs?`<tr><td colspan="19" style="padding:2px 8px 4px 28px;font-size:7.5px;color:#444;font-style:italic;border-top:none">↳ Obs: ${p.obs.replace(/</g,'&lt;')}</td></tr>`:''}`;
  }).join('');
  const clHtml=`
  <div class="card" style="margin-bottom:8px;border:1px solid #ccc">
    <div style="background:#f0f0f0;color:#000;padding:5px 10px;font-weight:700;font-size:10px;border-bottom:1px solid #ccc">
      Control en Línea — ${l.linea.length} pallets
    </div>
    <div class="tw"><table class="lt" style="width:100%;table-layout:fixed"><thead>
      <tr>
        <th rowspan="2" style="width:20px">#</th>
        <th rowspan="2">N° Pallet</th>
        <th rowspan="2">Fecha</th>
        <th rowspan="2">Hora</th>
        <th colspan="4" class="gh">PESO POR PICO (kg)</th>
        <th colspan="4" class="gh">IDENTIFICACIÓN</th>
        <th colspan="2" class="gh">INDUCCIÓN</th>
        <th colspan="3" class="gh">CONTROL EN LÍNEA</th>
      </tr>
      <tr>
        <th style="background:#2a6a6a;color:#fff">P1</th><th style="background:#2a6a6a;color:#fff">P2</th><th style="background:#2a6a6a;color:#fff">P3</th><th style="background:#2a6a6a;color:#fff">P4</th>
        <th style="background:#2a6a6a;color:#fff">Lote</th><th style="background:#2a6a6a;color:#fff">Cód</th><th style="background:#2a6a6a;color:#fff">F.Prod</th><th style="background:#2a6a6a;color:#fff">F.Venc</th>
        <th style="background:#2a6a6a;color:#fff">OK/NOK</th><th style="background:#2a6a6a;color:#fff">${indLbl}</th>
        <th style="background:#2a6a6a;color:#fff">QR</th><th style="background:#2a6a6a;color:#fff">Pack</th><th style="background:#2a6a6a;color:#fff">Plt</th>
      </tr>
    </thead><tbody>${clRows}</tbody></table></div>
  </div>`;
  const cfRows=l.final.pallets.map((p,i)=>{
    const _hasNOK=_cfHasNakedNOK(p);
    const _hasRepro=_cfHasAnyRepro(p);
    const rowStyle=_hasNOK?'background:rgba(239,68,68,.07)':_hasRepro?'background:rgba(251,146,60,.07)':'';
    const vacio=p.idOK===null&&p.qrOK===null&&p.paletOK===null&&p.indCFOK===null?'pal-vacio':'';
    return `<tr class="${vacio}" style="${rowStyle}">
      <td class="n">${i+1}</td>
      <td style="text-align:center">${_st(p.idOK,p.idRepro)}</td>
      <td style="text-align:center">${_st(p.qrOK,p.qrRepro)}</td>
      <td style="text-align:center">${_st(p.paletOK,p.paletRepro)}</td>
      <td style="text-align:center">${_st(p.indCFOK,p.indCFRepro)}</td>
      <td style="text-align:center;font-family:var(--mono)">${p.litrosParcial||'—'}</td>
    </tr>
    ${p.obs?`<tr><td colspan="6" style="padding:2px 8px 4px 28px;font-size:7.5px;color:#444;font-style:italic;border-top:none">↳ Obs: ${p.obs.replace(/</g,'&lt;')}</td></tr>`:''}`;
  }).join('');
  const cfHtml=`
  <div class="card" style="margin-bottom:8px;border:1px solid #ccc">
    <div style="background:#f0f0f0;color:#000;padding:5px 10px;font-weight:700;font-size:10px;border-bottom:1px solid #ccc">
      Control Final — ${l.final.pallets.length} pallets${l.final.dictamen?' · '+l.final.dictamen:''}
    </div>
    <div class="tw"><table class="ft" style="width:100%;table-layout:fixed"><thead>
      <tr>
        <th>#</th>
        <th>N° Pallet</th>
        <th>Trazabilidad / QR</th>
        <th>Estado pallet</th>
        <th>Inducción CF</th>
        <th>Lt parcial</th>
      </tr>
    </thead><tbody>${cfRows}</tbody></table></div>
  </div>`;
  const hallazgos=l.hallazgos||[];
  const hallHtml=hallazgos.length?`
  <div class="card" style="margin-bottom:8px;border:1px solid #ccc">
    <div style="background:#f0f0f0;color:#000;padding:5px 10px;font-weight:700;font-size:10px;border-bottom:1px solid #ccc">
      Observaciones del lote (${hallazgos.length})
    </div>
    <div style="padding:6px 10px;font-size:8px;font-family:Arial,sans-serif">
      ${hallazgos.map(h=>`<div style="padding:4px 0;border-bottom:1px solid #eee">
        <span style="color:#888;font-size:7px">${h.ts||''}</span>
        <div style="margin-top:2px;white-space:pre-wrap">${(h.txt||'').replace(/</g,'&lt;')}</div>
      </div>`).join('')}
    </div>
  </div>`:'';
  const footerHtml=`<div id="print-footer">QUALITYOS &nbsp;·&nbsp; M.E. ROCA &nbsp;·&nbsp; V2.0</div>`;
  return cabHtml+clHtml+cfHtml+hallHtml+footerHtml;
}
