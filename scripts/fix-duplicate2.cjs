const fs = require('fs');
const path = require('path');

const files = [
  'AppRCM.jsx',
  'AppImobiliaria.jsx',
  'AppFarmaceutica.jsx',
  'AppAutomovel.jsx'
];

function replaceBetween(str, startStr, endStr, replacement) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) throw new Error('Start ' + startStr + ' not found');
  
  let endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) throw new Error('End ' + endStr + ' not found');
  
  return str.substring(0, startIdx) + replacement + str.substring(endIdx);
}

files.forEach(file => {
  const filePath = path.join(__dirname, '../src', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: stopContinuousListen removing onstop
  const stopOld = `  const stopContinuousListen = useCallback(() => {
    if (vadRef.current) {
      try { vadRef.current.abort(); } catch (_) {}
      vadRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);`;
  
  const stopNew = `  const stopContinuousListen = useCallback(() => {
    if (vadRef.current) {
      try { vadRef.current.abort(); } catch (_) {}
      vadRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null; // Previne que o onstop processe silêncio
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);`;
  
  content = content.replace(stopOld, stopNew);

  // Fix 2: the isFinal block
  const isFinalReplacement = `        if (e.results[i].isFinal) {
          const fallbackText = e.results[i][0].transcript.trim();
          if (!fallbackText || sessionModeRef.current !== "active") continue;
          if (mediaRecorder.state === "inactive") continue;
          
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // reset
            
            // Restart recorder for next phrase if still active
            if (sessionModeRef.current === "active") {
              try { mediaRecorder.start(); } catch (_) {}
            }

            // Ignorar áudio vazio gerado por paragens forçadas
            if (audioBlob.size === 0) return;

            try {
              // Deepgram API Call`;

  // We find the block starting with "if (e.results[i].isFinal) {" and ending with "// Deepgram API Call"
  content = replaceBetween(content, '        if (e.results[i].isFinal) {', '              // Deepgram API Call', isFinalReplacement);

  // Insert the mediaRecorder.stop() right after setting onstop
  // Actually, wait, let's just make the replacement even simpler.
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
