const fs = require('fs');
const path = require('path');

const files = [
  'AppRCM.jsx',
  'AppImobiliaria.jsx',
  'AppFarmaceutica.jsx',
  'AppAutomovel.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace keywords= with keyterm=
  // Only inside the deepgram URL
  
  if (content.includes('keywords=')) {
    content = content.replace(/keywords=/g, 'keyterm=');
    fs.writeFileSync(filePath, content);
    console.log('Fixed URL in', file);
  }
});
