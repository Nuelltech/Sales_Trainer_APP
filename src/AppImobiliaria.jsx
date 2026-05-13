import { useState, useRef, useEffect, useCallback } from "react";

// --- PROFILES ---
const PROFILES = [
  {
    id: 'manuel', name: 'Manuel Ferreira', role: 'Proprietário a vender', location: 'Porto',
    avatar: '👴', color: '#c0392b', voiceId: 'yoZ06aMxZJJ28mfd3POQ',
    pain: 'Quer vender rápido (precisa do dinheiro para herança), mas não quer dar a casa.',
    objections: ['Já tenho 3 agências a tratar disso', 'Exclusividade? Nem pensar', '6% de comissão é um roubo', 'Vocês só querem a comissão', 'Já me disseram que valia 280k e não venderam'],
    personality: 'Cansado de agentes, sarcástico, faz perguntas antes de deixar falar.',
    context: 'Colocou anúncio no Idealista há 2 semanas. Já recebeu 7 chamadas de agentes.',
    specificData: { orcamento: 'N/A', objetivo_venda: 'Rápido, mas preço justo', tipo_imovel: 'Apartamento Herdado' }
  },
  {
    id: 'sofia', name: 'Sofia Antunes', role: 'Compradora indecisa', location: 'Lisboa',
    avatar: '👩', color: '#8e44ad', voiceId: 'EXAVITQu4vr4xnSDxMaL',
    pain: 'Tem medo de se comprometer. O marido e ela não estão totalmente alinhados.',
    objections: ['Está muito giro mas temos mais para ver', 'A outra agência tem um parecido mais barato', 'Precisamos de falar os dois com calma', 'Não temos pressa, o mercado vai baixar', 'Posso contactar o proprietário?'],
    personality: 'Simpática mas evasiva. Diz sempre vamos pensar. Usa outras agências como escudo.',
    context: 'Está a ver imóveis há 4 meses. Acaba de visitar um T2 contigo.',
    specificData: { orcamento: '350.000€', tipologia_desejada: 'T2 com varanda', situacao: 'Crédito pré-aprovado' }
  },
  {
    id: 'ricardo', name: 'Ricardo Neves', role: 'Proprietário resistente', location: 'Braga',
    avatar: '🧔', color: '#2980b9', voiceId: 'VR6AewLTigWG4xSOukaG',
    pain: 'Casa no mercado há 3 meses sem propostas. Preço acima do mercado.',
    objections: ['Com exclusividade perdem a motivação', 'Vi casas iguais por 320k no Idealista', 'Porque hei de confiar em vocês?', '3 meses de contrato? E se não venderem?', 'A comissão baixa se eu trouxer comprador?'],
    personality: 'Teimoso, acha que sabe mais que os agentes. Compara com o Idealista.',
    context: 'Reunião presencial. Propões contrato de exclusividade.',
    specificData: { preco_atual: '320.000€', preco_real_mercado: '290.000€', tempo_no_mercado: '3 meses' }
  },
  {
    id: 'paulo', name: 'Paulo (Investidor)', role: 'Investidor', location: 'Lisboa',
    avatar: '👔', color: '#2c3e50', voiceId: 'TxGEqnHWrfWFTfGW9XjX',
    pain: 'Já teve má experiência com agente que lhe vendeu imóvel com problemas escondidos.',
    objections: ['Qual é o yield bruto típico?', 'Trabalho com advogado próprio', 'Já tenho agentes de confiança', 'Que garantias me dão do imóvel?', 'Mandem-me portefólio que eu vejo'],
    personality: 'Frio, calculista, foca-se na rentabilidade e due diligence.',
    context: 'Evento de networking. Tens 5 minutos para agendar reunião.',
    specificData: { orcamento: '1.5M€', yield_minimo: '6%', foco: 'Arrendamento de longa duração' }
  }
];
const OBJECTIVES = [
  { id: 'qualificacao', label: 'Qualificar', desc: 'Descobrir urgência e capacidade financeira', icon: '🔍' },
  { id: 'angariacao', label: 'Angariação', desc: 'Vender exclusividade ao proprietário', icon: '📜' },
  { id: 'fecho', label: 'Fecho de Visita', desc: 'Avançar para proposta formal', icon: '🔑' },
];
const CRITERIA = [
  { id: 'hook', label: 'Empatia inicial', weight: 20 },
  { id: 'pain', label: 'Qualificação financeira', weight: 25 },
  { id: 'value', label: 'Foco no Cliente', weight: 20 },
  { id: 'objection', label: 'Gestão de Objeções', weight: 20 },
  { id: 'close', label: 'Call to Action', weight: 15 },
];
// --- MAIN COMPONENT ---
export default function AppImobiliaria() {
  const [screen, setScreen] = useState("setup"); // setup | session | feedback
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionMode, setSessionMode] = useState("idle"); // idle | countdown | active | speaking
  const [countdownValue, setCountdownValue] = useState(5);

  const chatRef = useRef(null);
  const currentAudioRef = useRef(null);
  const transcriptRef = useRef([]);
  const vadRef = useRef(null); // SpeechRecognition instance (continuous)
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const sessionModeRef = useRef("idle");
  const selectedProfileRef = useRef(null);
  const selectedObjectiveRef = useRef(null);

  // Keep refs in sync
  useEffect(() => { sessionModeRef.current = sessionMode; }, [sessionMode]);
  useEffect(() => { selectedProfileRef.current = selectedProfile; }, [selectedProfile]);
  useEffect(() => { selectedObjectiveRef.current = selectedObjective; }, [selectedObjective]);


  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [transcript]);

  const speakElevenLabs = useCallback(async (text, voiceId) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsSpeaking(true);
      setSessionMode("speaking");
      const res = await fetch(`/elevenlabs/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      await new Promise((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play();
      });
    } catch (err) {
      console.warn("ElevenLabs TTS error — usando fallback do browser:", err);
      // --- Fallback: Web Speech API (gratuito, integrado no browser) ---
      await new Promise((resolve) => {
        if (!window.speechSynthesis) { resolve(); return; }
        window.speechSynthesis.cancel();
        const speak = () => {
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = "pt-PT";
          utter.rate = 0.95;
          utter.pitch = 1.0;
          // Escolhe a melhor voz PT-PT disponível no browser
          const voices = window.speechSynthesis.getVoices();
          const ptPT = voices.find(v => v.lang === "pt-PT") ||
                       voices.find(v => v.lang.startsWith("pt")) ||
                       null;
          if (ptPT) utter.voice = ptPT;
          utter.onend = resolve;
          utter.onerror = resolve;
          window.speechSynthesis.speak(utter);
        };
        // Vozes podem ainda não estar carregadas — aguarda se necessário
        if (window.speechSynthesis.getVoices().length > 0) {
          speak();
        } else {
          window.speechSynthesis.onvoiceschanged = () => speak();
        }
      });
    } finally {
      currentAudioRef.current = null;
      setIsSpeaking(false);
      setSessionMode("active");
    }
  }, []);

  const handleVoiceInput = useCallback(() => {}, []); // kept for API compat

  // Continuous speech recognition VAD + Deepgram
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
              const res = await fetch(`/deepgram/v1/listen?language=pt-PT&model=nova-3&smart_format=true&keyterm=T0&keyterm=T1&keyterm=T2&keyterm=T3&keyterm=IMT&keyterm=CPCV&keyterm=spread&keyterm=Euribor&keyterm=escritura&keyterm=angaria%C3%A7%C3%A3o`, {
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
      mediaRecorderRef.current.onstop = null; // Previne duplicate trigger
      try { mediaRecorderRef.current.stop(); } catch (_) {}
      mediaRecorderRef.current = null;
    }
  }, []);

  const startSession = () => {
    if (!selectedProfile || !selectedObjective) return;
    setScreen("session");
    setSessionMode("countdown");
    setCountdownValue(5);
    setTranscript([]);
    let count = 5;
    const timer = setInterval(async () => {
      count -= 1;
      setCountdownValue(count);
      if (count <= 0) {
        clearInterval(timer);
        setSessionMode("speaking");
        const profile = PROFILES.find((p) => p.id === selectedProfile);
        const intro = `Olá. Sou ${profile.name}. ${profile.context}`;
        setTranscript([{ role: "client", text: intro }]);
        await speakElevenLabs(intro, profile.voiceId);
      }
    }, 1000);
  };

  const fetchWithRetry = async (url, options, retries = 3, backoff = 1500) => {
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (data.error && data.error.type === 'overloaded_error' && retries > 0) {
        console.warn(`Anthropic overloaded. Retrying in ${backoff}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      return { res, data };
    } catch (err) {
      if (retries > 0) {
        console.warn(`Fetch error, retrying in ${backoff}ms...`, err);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  const sendMessageWithText = async (userMsg) => {
    if (!userMsg || isLoading) return;
    // Use refs to avoid stale closures from event handlers
    const profileId = selectedProfileRef.current;
    const objectiveId = selectedObjectiveRef.current;
    if (!profileId) return;
    const profile = PROFILES.find((p) => p.id === profileId);
    const obj = OBJECTIVES.find((o) => o.id === objectiveId);
    if (!profile) return;
    const newTranscript = [...transcriptRef.current, { role: "user", text: userMsg }];
    setTranscript(newTranscript);
    setIsLoading(true);

    const systemPrompt = `És ${profile.name}, ${profile.role} em ${profile.location}.\nPersonalidade: ${profile.personality}\nContexto: ${profile.context}\nDor principal: ${profile.pain}\nObjeção típica: ${profile.objections.join(', ')}\n\nDADOS ESPECÍFICOS (só revelares se perguntado diretamente):\n${Object.entries(profile.specificData).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\nREGRAS DE COMPORTAMENTO:\n- És uma pessoa real e não facilitas a vida ao consultor imobiliário.\n- Só respondes ao que te perguntam.\n- Se o consultor for vago, tentas despachá-lo.\n- Se o consultor fizer uma boa pergunta, respondes com um pouco mais de detalhe.\n- Levantas a objeção típica naturalmente.\n- Mantém respostas curtas: 2 a 3 frases no máximo.\n- Fala em português coloquial de Portugal.\n\nO vendedor chama-se Nuno e é um Consultor Imobiliário experiente.`;
    const messages = newTranscript.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));
    try {
      const { data } = await fetchWithRetry("/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages,
        }),
      });
      if (data.error) throw new Error(data.error.message || "Erro na API");
      const reply = data.content?.[0]?.text || "...";
      const updated = [...newTranscript, { role: "client", text: reply }];
      setTranscript(updated);
      await speakElevenLabs(reply, profile.voiceId);
    } catch (err) {
      console.error(err);
      setTranscript([...newTranscript, { role: "client", text: `(Erro: ${err.message})` }]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText("");
    await sendMessageWithText(text);
  };

  const getFeedback = async () => {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    setIsLoading(true);
    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);
    const convo = transcript.map((m) => `${m.role === "user" ? "NUNO" : profile.name}: ${m.text}`).join("\n");
    const objectiveCriteria = {
      qualificacao: 'Avalia se Nuno fez perguntas abertas sobre motivo de compra/venda, prazo desejado e capacidade financeira/crédito.',
      angariacao: 'Avalia se Nuno explicou o valor da exclusividade, como o plano de marketing vai resolver a dor, sem baixar a comissão facilmente.',
      fecho: 'Avalia se Nuno respondeu às objeções da visita e conseguiu compromisso para uma segunda visita ou apresentação de proposta.',
    };
    const prompt = `Analisa esta conversa de treino de vendas e dá feedback como um coach de vendas imobiliárias experiente em Portugal.\n\nPERFIL DO CLIENTE: ${profile.name} — ${profile.role}. ${profile.personality}
OBJETIVO DA CONVERSA: ${obj.label} — ${objectiveCriteria[obj.id]}

CONVERSA:
${convo}

Responde APENAS em JSON, sem markdown, com este formato exato:
{
  "scores": {
    "hook": <0-100>,
    "pain": <0-100>,
    "value": <0-100>,
    "objection": <0-100>,
    "close": <0-100>
  },
  "overall": <0-100>,
  "grade": "<A+ | A | B+ | B | C | D>",
  "highlight": "<o melhor momento da conversa, 1 frase>",
  "miss": "<o momento mais fraco, 1 frase>",
  "tip": "<1 técnica concreta para melhorar imediatamente>",
  "summary": "<análise geral em 2-3 frases, tom de coach direto>"
}`;
    try {
      const { data } = await fetchWithRetry("/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (data.error) throw new Error(data.error.message || "Erro na API");
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setFeedback(parsed);
      setSessionMode("idle");
      setScreen("feedback");
    } catch (err) {
      console.error(err);
      alert(`Erro ao gerar feedback: ${err.message}`);
    }
    setIsLoading(false);
  };

  const reset = () => {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    setScreen("setup");
    setSelectedProfile(null);
    setSelectedObjective(null);
    setTranscript([]);
    setFeedback(null);
    setInputText("");
    setIsSpeaking(false);
    setSessionMode("idle");
  };

  const gradeColor = (g) => ({ "A+": "#00e676", A: "#69f0ae", "B+": "#ffeb3b", B: "#ffd740", C: "#ff9800", D: "#f44336" }[g] || "#fff");

  // Start/stop continuous VAD based on sessionMode
  useEffect(() => {
    if (screen !== "session") return;
    if (sessionMode === "active" && !isSpeaking) {
      startContinuousListen();
    } else {
      stopContinuousListen();
    }
  }, [sessionMode, isSpeaking, screen]);

  // Cleanup on screen change
  useEffect(() => {
    if (screen !== "session") stopContinuousListen();
  }, [screen]);

  // ===================== SCREENS =====================

  if (screen === "setup") {
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={styles.logo}>IMO</div>
          <h1 style={styles.title}>Imobiliária Training</h1>
          <p style={styles.subtitle}>Treina a tua abordagem de angariação e venda de imóveis</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.step}>1</span> Escolhe o perfil do cliente
          </h2>
          <div style={styles.grid2}>
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                style={{
                  ...styles.card,
                  borderColor: selectedProfile === p.id ? p.color : "rgba(255,255,255,0.08)",
                  background: selectedProfile === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>{p.avatar}</div>
                <div style={{ ...styles.cardName, color: selectedProfile === p.id ? p.color : "#fff" }}>{p.name}</div>
                <div style={styles.cardRole}>{p.role}</div>
                <div style={styles.cardLocation}>📍 {p.location}</div>
                <div style={styles.cardPain}>{p.pain}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 6, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6 }}>
                  {p.context}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.step}>2</span> Define o objetivo
          </h2>
          <div style={styles.grid2}>
            {OBJECTIVES.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedObjective(o.id)}
                style={{
                  ...styles.card,
                  borderColor: selectedObjective === o.id ? "#f0b429" : "rgba(255,255,255,0.08)",
                  background: selectedObjective === o.id ? "rgba(240,180,41,0.1)" : "rgba(255,255,255,0.03)",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 26 }}>{o.icon}</span>
                <div>
                  <div style={{ ...styles.cardName, color: selectedObjective === o.id ? "#f0b429" : "#fff" }}>{o.label}</div>
                  <div style={styles.cardPain}>{o.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startSession}
          disabled={!selectedProfile || !selectedObjective}
          style={{
            ...styles.btnPrimary,
            opacity: !selectedProfile || !selectedObjective ? 0.4 : 1,
            cursor: !selectedProfile || !selectedObjective ? "not-allowed" : "pointer",
          }}
        >
          🎙️ Iniciar Sessão
        </button>
      </div>
    );
  }

  if (screen === "session") {
    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);
    return (
      <div style={{ ...styles.root, position: "relative" }}>
        {/* Countdown overlay */}
        {sessionMode === "countdown" && (
          <div style={styles.countdownOverlay}>
            <div style={{ ...styles.countdownNum, animation: "countdownPulse 1s ease-in-out infinite" }}>
              {countdownValue}
            </div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 16 }}>Prepara-te para falar...</div>
          </div>
        )}

        {/* Session bar */}
        <div style={{ ...styles.sessionBar, borderColor: profile.color }}>
          <div>
            <span style={{ fontSize: 20 }}>{profile.avatar}</span>{" "}
            <span style={{ color: profile.color, fontWeight: 700 }}>{profile.name}</span>{" "}
            <span style={styles.roleTag}>{profile.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isSpeaking && (
              <span style={styles.speakingIndicator}>🔊 {profile.name.split(" ")[0]} a falar...</span>
            )}
            {sessionMode === "active" && !isSpeaking && (
              <span style={styles.vadIndicator}>🎙️ O teu turno...</span>
            )}
            <div style={styles.objTag}>{obj.icon} {obj.label}</div>
          </div>
        </div>

        {/* Chat */}
        <div ref={chatRef} style={styles.chat}>
          {transcript.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#1a3a5c" : "rgba(255,255,255,0.06)",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                maxWidth: "78%",
              }}
            >
              {m.role === "client" && <div style={{ color: profile.color, fontSize: 11, marginBottom: 3, fontWeight: 700 }}>{profile.name}</div>}
              {m.text}
            </div>
          ))}
          {isLoading && (
            <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "rgba(255,255,255,0.04)", color: "#666" }}>
              <span style={styles.dots}>● ● ●</span>
            </div>
          )}
        </div>

        {/* Input — always visible as fallback */}
        <div style={styles.inputArea}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escreve se preferires não usar voz..."
            style={styles.input}
          />
          <button onClick={sendMessage} disabled={isLoading} style={styles.sendBtn}>➤</button>
        </div>

        <div style={styles.actions}>
          <button onClick={reset} style={styles.btnSecondary}>← Recomeçar</button>
          <button
            onClick={getFeedback}
            disabled={transcript.length < 4 || isLoading}
            style={{ ...styles.btnPrimary, opacity: (transcript.length < 4 || isLoading) ? 0.4 : 1 }}
          >
            {isLoading ? "A carregar..." : "⏹ Terminar"}
          </button>
        </div>
      </div>
    );
  }

  if (screen === "feedback" && feedback) {
    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>{profile.avatar}</div>
          <h1 style={{ ...styles.title, fontSize: 20, marginTop: 8 }}>
            {profile.name} · {obj.label}
          </h1>
        </div>

        {/* Overall score */}
        <div style={styles.scoreBox}>
          <div style={{ ...styles.grade, color: gradeColor(feedback.grade) }}>{feedback.grade}</div>
          <div style={styles.overallNum}>{feedback.overall}<span style={{ fontSize: 16, color: "#888" }}>/100</span></div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 4, textAlign: "center" }}>{feedback.summary}</div>
        </div>

        {/* Criteria bars */}
        <div style={styles.section}>
          {CRITERIA.map((c) => {
            const score = feedback.scores?.[c.id] ?? 0;
            const color = score >= 80 ? "#00e676" : score >= 60 ? "#ffeb3b" : "#f44336";
            return (
              <div key={c.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#ccc", fontSize: 13 }}>{c.label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: 13 }}>{score}</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${score}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cards */}
        <div style={styles.feedbackCards}>
          <div style={{ ...styles.fCard, borderColor: "#00e676" }}>
            <div style={{ color: "#00e676", fontWeight: 700, marginBottom: 4 }}>✅ Melhor momento</div>
            <div style={{ color: "#ccc", fontSize: 13 }}>{feedback.highlight}</div>
          </div>
          <div style={{ ...styles.fCard, borderColor: "#f44336" }}>
            <div style={{ color: "#f44336", fontWeight: 700, marginBottom: 4 }}>⚠️ Ponto fraco</div>
            <div style={{ color: "#ccc", fontSize: 13 }}>{feedback.miss}</div>
          </div>
          <div style={{ ...styles.fCard, borderColor: "#f0b429", gridColumn: "1 / -1" }}>
            <div style={{ color: "#f0b429", fontWeight: 700, marginBottom: 4 }}>💡 Técnica para aplicar já</div>
            <div style={{ color: "#ccc", fontSize: 13 }}>{feedback.tip}</div>
          </div>
        </div>

        {/* Transcript Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Transcrição da Conversa</h2>
          <div style={styles.transcriptList}>
            {transcript.map((m, i) => (
              <div key={i} style={styles.transcriptItem}>
                <span style={{ 
                  color: m.role === "user" ? "#f0b429" : profile.color,
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  marginRight: 8
                }}>
                  {m.role === "user" ? "Nuno" : profile.name}:
                </span>
                <span style={{ fontSize: 13, color: "#ccc" }}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={reset} style={styles.btnSecondary}>← Nova Sessão</button>
          <button
            onClick={async () => {
              setFeedback(null);
              setTranscript([]);
              const profile = PROFILES.find((p) => p.id === selectedProfile);
              const intro = `Olá. Sou ${profile.name}. ${profile.context}`;
              setTranscript([{ role: "client", text: intro }]);
              setScreen("session");
              await speakElevenLabs(intro, profile.voiceId);
            }}
            style={styles.btnPrimary}
          >
            🔄 Repetir Perfil
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ===================== STYLES =====================
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0e17",
    color: "#e8eaf6",
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    padding: "24px 16px 48px",
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: {
    textAlign: "center",
    paddingTop: 8,
  },
  logo: {
    display: "inline-block",
    background: "#f0b429",
    color: "#0a0e17",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 3,
    padding: "3px 10px",
    borderRadius: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    margin: 0,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#666",
    fontSize: 13,
    margin: "8px 0 0",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#888",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  step: {
    background: "#f0b429",
    color: "#0a0e17",
    borderRadius: "50%",
    width: 22,
    height: 22,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    flexShrink: 0,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 14,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    transition: "all 0.15s ease",
    color: "#e8eaf6",
  },
  cardName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  cardRole: {
    fontSize: 11,
    color: "#888",
    marginBottom: 3,
  },
  cardLocation: {
    fontSize: 10,
    color: "#666",
    marginBottom: 6,
  },
  cardPain: {
    fontSize: 11,
    color: "#999",
    lineHeight: 1.5,
  },
  btnPrimary: {
    background: "#f0b429",
    color: "#0a0e17",
    border: "none",
    borderRadius: 10,
    padding: "14px 24px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.5,
    width: "100%",
  },
  btnSecondary: {
    background: "transparent",
    color: "#888",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  sessionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    border: "1.5px solid",
    fontSize: 13,
  },
  roleTag: {
    fontSize: 11,
    color: "#666",
  },
  objTag: {
    fontSize: 11,
    color: "#f0b429",
    background: "rgba(240,180,41,0.1)",
    padding: "3px 8px",
    borderRadius: 6,
  },
  chat: {
    flex: 1,
    minHeight: 320,
    maxHeight: 420,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "4px 0",
  },
  bubble: {
    padding: "10px 14px",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#dde",
  },
  dots: {
    letterSpacing: 4,
    animation: "pulse 1s infinite",
  },
  inputArea: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    padding: "12px 14px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#f0b429",
    color: "#0a0e17",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  actions: {
    display: "flex",
    gap: 10,
  },
  scoreBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "24px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  grade: {
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: -2,
  },
  overallNum: {
    fontSize: 28,
    fontWeight: 800,
    marginTop: 4,
  },
  barBg: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    height: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.8s ease",
  },
  feedbackCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  fCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1.5px solid",
    borderRadius: 12,
    padding: "14px",
  },
  countdownOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    background: "rgba(10,14,23,0.92)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },
  countdownNum: {
    fontSize: 120,
    fontWeight: 900,
    color: "#f0b429",
    lineHeight: 1,
    letterSpacing: -4,
  },
  speakingIndicator: {
    fontSize: 11,
    color: "#f0b429",
    background: "rgba(240,180,41,0.12)",
    padding: "3px 8px",
    borderRadius: 6,
    animation: "wavePulse 1.2s ease-in-out infinite",
  },
  vadIndicator: {
    fontSize: 11,
    color: "#00e676",
    background: "rgba(0,230,118,0.1)",
    padding: "3px 8px",
    borderRadius: 6,
  },
  transcriptList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 14,
    maxHeight: 300,
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  transcriptItem: {
    lineHeight: 1.5,
    paddingBottom: 4,
    borderBottom: "1px solid rgba(255,255,255,0.02)",
  },
};
