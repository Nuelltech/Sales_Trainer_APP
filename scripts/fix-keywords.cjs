const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AppRCM.jsx', keywords: 'RCM, AuditorPRO, CMV, ticket médio, margem bruta, POS, ZS' },
  { name: 'AppImobiliaria.jsx', keywords: 'T0, T1, T2, T3, IMT, CPCV, spread, Euribor, escritura, angariação' },
  { name: 'AppFarmaceutica.jsx', keywords: 'off-label, farmacocinética, posologia, ensaio clínico, placebo, comparticipação' },
  { name: 'AppAutomovel.jsx', keywords: 'WLTP, Wallbox, kW, kWh, supercharger, autonomia, híbrido plug-in' }
];

files.forEach(app => {
  const filePath = path.join(__dirname, '../src', app.name);
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to replace the fetch URL
  const oldUrlStr = "&keywords=${encodeURIComponent('" + app.keywords + "')}";
  
  // New: ?keywords=A&keywords=B
  const keywordsQuery = app.keywords.split(',').map(k => "keywords=" + encodeURIComponent(k.trim())).join('&');
  const newUrlStr = "&" + keywordsQuery;
  
  content = content.replace(oldUrlStr, newUrlStr);
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed URL in', app.name);
});
