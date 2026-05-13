const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AppRCM.jsx', keywords: 'RCM, AuditorPRO, CMV, ticket médio, margem bruta, POS, ZS' },
  { name: 'AppImobiliaria.jsx', keywords: 'T0, T1, T2, T3, IMT, CPCV, spread, Euribor, escritura, angariação' },
  { name: 'AppFarmaceutica.jsx', keywords: 'off-label, farmacocinética, posologia, ensaio clínico, placebo, comparticipação' },
  { name: 'AppAutomovel.jsx', keywords: 'WLTP, Wallbox, kW, kWh, supercharger, autonomia, híbrido plug-in' }
];

const refsToReplace = `  const vadRef = useRef(null); // SpeechRecognition instance (continuous)
  const sessionModeRef = useRef("idle");`;

const refsReplacement = `  const vadRef = useRef(null); // SpeechRecognition instance (continuous)
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const sessionModeRef = useRef("idle");`;

function getListenCode(keywords) {
  return `  // Continuous speech recognition VAD + Deepgram
  const startContinuousListen = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || vadRef.current) return;
    
    try {
      if (!audioStreamRef.current) {
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      console.warn("Microfone indisponível", err);
      return;
    }

    const recognition = new SR();
    recognition.lang = "pt-PT";
    recognition.continuous = true;
    recognition.interimResults = false;

    // Start MediaRecorder
    let audioChunks = [];
    const mediaRecorder = new MediaRecorder(audioStreamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    recognition.onresult = async (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const fallbackText = e.results[e.results.length - 1][0].transcript.trim();
          if (!fallbackText || sessionModeRef.current !== "active") continue;
          
          // Stop recorder to send to Deepgram
          mediaRecorder.stop();
          
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // reset
            
            // Restart recorder for next phrase if still active
            if (sessionModeRef.current === "active") {
              try { mediaRecorder.start(); } catch (_) {}
            }

            try {
              // Deepgram API Call
              const res = await fetch(\`/deepgram/v1/listen?language=pt-PT&model=nova-3&smart_format=true&keywords=\${encodeURIComponent('${keywords}')}\`, {
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
          break; // Process only the first final result
        }
      }
    };
    
    recognition.onend = () => {
      if (sessionModeRef.current === "active" && vadRef.current === recognition) {
        setTimeout(() => {
          if (sessionModeRef.current === "active" && vadRef.current === recognition) {
            try { recognition.start(); } catch (_) {}
          }
        }, 300);
      }
    };
    
    recognition.onerror = (e) => {
      if (e.error === "network" || e.error === "service-not-allowed") {
        vadRef.current = null;
        return;
      }
    };
    
    vadRef.current = recognition;
    try { 
      recognition.start(); 
      mediaRecorder.start();
    } catch (_) {}
  }, []);

  const stopContinuousListen = useCallback(() => {
    if (vadRef.current) {
      try { vadRef.current.abort(); } catch (_) {}
      vadRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);`;
}

function replaceBetween(str, startStr, endStr, replacement) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) throw new Error('Start ' + startStr + ' not found');
  
  let endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) throw new Error('End ' + endStr + ' not found');
  
  return str.substring(0, startIdx) + replacement + '\n\n' + str.substring(endIdx);
}

files.forEach(app => {
  const filePath = path.join(__dirname, '../src', app.name);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Refs
  content = content.replace(refsToReplace, refsReplacement);

  // Replace Listen logic
  const startListen = '  // Continuous speech recognition VAD';
  const endListen = '  const startSession = () => {';
  content = replaceBetween(content, startListen, endListen, getListenCode(app.keywords));

  fs.writeFileSync(filePath, content);
  console.log('Updated', app.name);
});
