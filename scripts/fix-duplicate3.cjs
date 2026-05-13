const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AppRCM.jsx', keywords: 'RCM, AuditorPRO, CMV, ticket médio, margem bruta, POS, ZS' },
  { name: 'AppImobiliaria.jsx', keywords: 'T0, T1, T2, T3, IMT, CPCV, spread, Euribor, escritura, angariação' },
  { name: 'AppFarmaceutica.jsx', keywords: 'off-label, farmacocinética, posologia, ensaio clínico, placebo, comparticipação' },
  { name: 'AppAutomovel.jsx', keywords: 'WLTP, Wallbox, kW, kWh, supercharger, autonomia, híbrido plug-in' }
];

function replaceBetween(str, startStr, endStr, replacement) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) throw new Error('Start ' + startStr + ' not found');
  
  let endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) throw new Error('End ' + endStr + ' not found');
  
  return str.substring(0, startIdx) + replacement + str.substring(endIdx);
}

files.forEach(app => {
  const filePath = path.join(__dirname, '../src', app.name);
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
      mediaRecorderRef.current.onstop = null; // Previne duplicate trigger
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);`;
  
  if (content.includes(stopOld)) {
    content = content.replace(stopOld, stopNew);
  }

  // Replace the whole onresult block
  const startResult = `    recognition.onresult = async (e) => {`;
  const endResult = `    recognition.onend = () => {`;
  
  const newResult = `    recognition.onresult = async (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const fallbackText = e.results[i][0].transcript.trim();
          if (!fallbackText || sessionModeRef.current !== "active") continue;
          if (mediaRecorder.state === "inactive") continue;
          
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // reset
            
            // Restart recorder for next phrase se ainda estivermos no turno do user
            if (sessionModeRef.current === "active") {
              try { mediaRecorder.start(); } catch (_) {}
            }

            try {
              // Deepgram API Call
              const res = await fetch(\`/deepgram/v1/listen?language=pt-PT&model=nova-3&smart_format=true&keywords=\${encodeURIComponent('${app.keywords}')}\`, {
                method: 'POST',
                body: audioBlob
              });
              if (!res.ok) throw new Error('Deepgram failed');
              const data = await res.json();
              const deepgramText = data.results?.channels[0]?.alternatives[0]?.transcript;
              
              if (deepgramText && deepgramText.trim().length > 0) {
                sendMessageWithText(deepgramText.trim());
              } else {
                sendMessageWithText(fallbackText);
              }
            } catch (err) {
              console.warn('Deepgram failed, using fallback:', err);
              sendMessageWithText(fallbackText);
            }
          };
          
          // Triggers onstop
          mediaRecorder.stop();
          break; // Process only the first final result
        }
      }
    };
    
`;

  content = replaceBetween(content, startResult, endResult, newResult);
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', app.name);
});
