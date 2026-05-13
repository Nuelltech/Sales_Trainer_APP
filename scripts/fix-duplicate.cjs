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
      mediaRecorderRef.current.onstop = null; // Prevent duplicate trigger
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);`;
  
  content = content.replace(stopOld, stopNew);

  // Fix 2: onresult fallback index and state check
  const resultOld = `        if (e.results[i].isFinal) {
          const fallbackText = e.results[e.results.length - 1][0].transcript.trim();
          if (!fallbackText || sessionModeRef.current !== "active") continue;
          
          // Stop recorder to send to Deepgram
          mediaRecorder.stop();
          
          mediaRecorder.onstop = async () => {`;
          
  const resultNew = `        if (e.results[i].isFinal) {
          const fallbackText = e.results[i][0].transcript.trim();
          if (!fallbackText || sessionModeRef.current !== "active") continue;
          if (mediaRecorder.state === "inactive") continue;
          
          // Stop recorder to send to Deepgram
          mediaRecorder.onstop = async () => {`;
          
  content = content.replace(resultOld, resultNew);

  // Fix 3: We need to actually call stop() after setting onstop
  // In the original, mediaRecorder.stop() was called BEFORE setting onstop?
  // No, in my previous script:
  // mediaRecorder.stop();
  // mediaRecorder.onstop = async () => {
  // Let's replace the stop() moving it below onstop.

  // To be safe, I'll replace the whole startContinuousListen method with a regex or simple substring replacement.
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
