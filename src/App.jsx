import { useState, useRef, useEffect } from "react";

// --- PROFILES ---
const PROFILES = [
  {
    id: "carlos",
    name: "Carlos Mendes",
    role: "Dono de Tasca",
    location: "Porto",
    avatar: "👨‍🍳",
    color: "#c0392b",
    pain: "Sente que trabalha muito e sobra pouco no fim do mês. Não tem hábito de analisar números.",
    objections: ["Não tenho tempo para isso", "Já uso uma folha de Excel", "Isso é para restaurantes grandes"],
    personality: "Cético, direto, pouco paciente. Valoriza praticidade acima de tudo.",
    context: "Tens 2 minutos enquanto ele está no intervalo do almoço. Atende o telefone a pensar que é o fornecedor.",
    financials: {
      faturacao: 18000,
      compras: 8500,
      lugares: 40,
      clientes_dia: 60,
      ticket_medio: 10,
      custos_fixos: 5500,
    },
  },
  {
    id: "ana",
    name: "Ana Rodrigues",
    role: "Gerente de Restaurante Familiar",
    location: "Braga",
    avatar: "👩‍💼",
    color: "#8e44ad",
    pain: "Acaba de assumir a gestão do restaurante dos pais. Quer modernizar mas tem medo de errar.",
    objections: ["Tenho pouca experiência com software", "Qual é o custo?", "Os meus pais não vão querer mudar"],
    personality: "Ansiosa mas curiosa. Gosta de detalhes e segurança. Responde bem a exemplos concretos.",
    context: "Respondeu a um post teu no Instagram sobre CMV alto em restaurantes familiares. Tem 10 minutos para falar.",
    financials: {
      faturacao: 22000,
      compras: 9000,
      lugares: 55,
      clientes_dia: 75,
      ticket_medio: 14,
      custos_fixos: 7000,
    },
  },
  {
    id: "rui",
    name: "Rui Ferreira",
    role: "Proprietário de 2 Restaurantes",
    location: "Lisboa",
    avatar: "🧑‍💻",
    color: "#2980b9",
    pain: "Tem dois espaços e não consegue perceber qual deles está a perder dinheiro.",
    objections: ["Já tenho contabilista", "Preciso de ver uma demo primeiro", "Quanto custa vs. o que ganho?"],
    personality: "Analítico, ocupado, orientado a ROI. Quer números antes de qualquer decisão.",
    context: "Encontraste-o numa conferência. Está disponível para conversar 5 min.",
    financials: {
      faturacao: 85000,
      compras: 38000,
      lugares: 120,
      clientes_dia: 280,
      ticket_medio: 18,
      custos_fixos: 28000,
    },
  },
  {
    id: "fatima",
    name: "Fátima Costa",
    role: "Chef-Proprietária",
    location: "Coimbra",
    avatar: "👩‍🍽️",
    color: "#27ae60",
    pain: "Apaixonada pela cozinha, odeia a parte financeira. Já teve meses a fechar no vermelho.",
    objections: ["Não percebo nada disso", "Não é para mim", "Tenho medo de descobrir coisas más"],
    personality: "Emotiva, criativa, resistente à parte de gestão. Responde bem a empatia e histórias.",
    context: "Segues-a no Instagram. Ela respondeu a um DM teu.",
    financials: {
      faturacao: 14000,
      compras: 6800,
      lugares: 30,
      clientes_dia: 45,
      ticket_medio: 16,
      custos_fixos: 5000,
    },
  },
  {
    id: "tiago",
    name: "Tiago Silveira",
    role: "Diretor Financeiro (CFO) de Grupo",
    location: "Lisboa",
    avatar: "👔",
    color: "#2c3e50",
    pain: "Precisa de consolidar dados de 4 unidades. O controller faz tudo no Excel e demora 3 dias a fechar o mês.",
    objections: ["Já temos ERP", "Quanto tempo demora a implementar?", "O meu controller já faz isso no Excel"],
    personality: "Analítico, pragmático, direto. Valoriza tempo, eficiência e ROI claro.",
    context: "Agendou uma reunião para avaliar ferramentas de gestão para o grupo. Tem 20 minutos.",
    financials: {
      faturacao: 180000,
      compras: 75000,
      lugares: 200,
      clientes_dia: 600,
      ticket_medio: 20,
      custos_fixos: 65000,
    },
  },
  {
    id: "joaquim",
    name: "Sr. Joaquim",
    role: "Proprietário de Restaurante Tradicional",
    location: "Viseu",
    avatar: "🤨",
    color: "#7f8c8d",
    pain: "Sente que todos querem lhe vender esquemas. Teve más experiências com software.",
    objections: ["Isso é tudo treta", "O software não cozinha", "Não quero ninguém a mexer nas minhas contas"],
    personality: "Extremamente desconfiado, defensivo. Responde com ceticismo e sarcasmo.",
    context: "Ligaste a frio. Ele atendeu a pensar que era o fornecedor de bebidas. Está ocupado e quer desligar.",
    financials: {
      faturacao: 12000,
      compras: 6000,
      lugares: 25,
      clientes_dia: 40,
      ticket_medio: 11,
      custos_fixos: 4500,
    },
  },
];

const OBJECTIVES = [
  { id: "discovery", label: "Descoberta", desc: "Identificar a dor principal e qualificar o cliente", icon: "🔍" },
  { id: "demo", label: "Apresentar RCM", desc: "Demonstrar o valor do AuditorPRO em 2 minutos", icon: "🚀" },
  { id: "objection", label: "Gerir Objeção", desc: "Responder à objeção principal do perfil", icon: "🛡️" },
  { id: "close", label: "Fechar Reunião", desc: "Conseguir agendar uma chamada ou demo formal", icon: "🎯" },
];

const CRITERIA = [
  { id: "hook", label: "Abertura forte", weight: 20 },
  { id: "pain", label: "Identificou a dor", weight: 20 },
  { id: "value", label: "Comunicou valor claro", weight: 25 },
  { id: "objection", label: "Respondeu a objeção", weight: 20 },
  { id: "close", label: "Propôs próximo passo", weight: 15 },
];

// --- MAIN COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | session | feedback
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("rcm_anthropic_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [transcript]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("rcm_anthropic_key", key);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-PT";
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "pt-PT";
    recognition.continuous = true;        // não corta
    recognition.interimResults = true;    // mostra palavras em tempo real
    
    recognition.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) setInputText((prev) => prev + " " + final);
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setTimeout(() => sendMessage(), 300);
    } else {
      startListening();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const startSession = () => {
    if (!selectedProfile || !selectedObjective) return;
    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);
    const intro = `Olá. Sou ${profile.name}. ${profile.context}`;
    setTranscript([{ role: "client", text: intro }]);
    speak(intro);
    setScreen("session");
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

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    if (!apiKey) {
      alert("Por favor, configura a tua Anthropic API Key primeiro.");
      setShowSettings(true);
      return;
    }

    const userMsg = inputText.trim();
    setInputText("");
    const newTranscript = [...transcript, { role: "user", text: userMsg }];
    setTranscript(newTranscript);
    setIsLoading(true);

    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);

    const systemPrompt = `És ${profile.name}, ${profile.role} em ${profile.location}.
Personalidade: ${profile.personality}
Contexto: ${profile.context}
Dor principal: ${profile.pain}
Objeção típica: ${profile.objections.join(", ")}

DADOS FINANCEIROS DO TEU RESTAURANTE (só revelares se perguntado diretamente, e nunca todos de uma vez):
- Faturação mensal: €${profile.financials.faturacao}
- Gastos em compras/mês: €${profile.financials.compras}
- Número de lugares: ${profile.financials.lugares}
- Clientes por dia (média): ${profile.financials.clientes_dia}
- Ticket médio: €${profile.financials.ticket_medio}
- Custos fixos mensais: €${profile.financials.custos_fixos}

REGRAS DE COMPORTAMENTO:
- És uma pessoa real que recebe chamadas de vendas todos os dias. Não facilitas a vida ao vendedor.
- Nunca ofereces informação voluntariamente. Só respondes ao que te perguntam, com relutância.
- Se o vendedor for vago ou não for direto, cortas a conversa: "Olha, não tenho tempo para isto."
- Se o vendedor fizer uma boa pergunta, respondes — mas com desconfiança.
- Levantas a objeção típica do teu perfil naturalmente, não como um robô.
- Nunca és demasiado fácil. O vendedor tem de merecer cada resposta.
- Mantém respostas curtas: 2 a 3 frases no máximo.
- Fala em português coloquial de Portugal. Sem formalidades excessivas.

O vendedor chama-se Nuno e está a vender o RCM — software de gestão de custos para restaurantes. Inclui AuditorPRO (diagnóstico financeiro), calculadora de CMV, e módulo de custos de pessoal.`;

    const messages = newTranscript.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const { res, data } = await fetchWithRetry("/anthropic/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages,
        }),
      });
      if (data.error) {
        console.error("Anthropic Error:", data.error);
        throw new Error(data.error.message || "Erro desconhecido na API");
      }
      const reply = data.content?.[0]?.text || "...";
      setTranscript([...newTranscript, { role: "client", text: reply }]);
      speak(reply);
    } catch (err) {
      console.error(err);
      setTranscript([...newTranscript, { role: "client", text: `(Erro: ${err.message})` }]);
    }
    setIsLoading(false);
  };

  const getFeedback = async () => {
    setIsLoading(true);
    if (!apiKey) {
      alert("Por favor, configura a tua Anthropic API Key primeiro.");
      setShowSettings(true);
      setIsLoading(false);
      return;
    }

    const profile = PROFILES.find((p) => p.id === selectedProfile);
    const obj = OBJECTIVES.find((o) => o.id === selectedObjective);
    const convo = transcript.map((m) => `${m.role === "user" ? "NUNO" : profile.name}: ${m.text}`).join("\n");

    const objectiveCriteria = {
      discovery: "Avalia se Nuno fez perguntas abertas, se identificou a dor real, e se qualificou o cliente sem falar do produto demasiado cedo.",
      demo: "Avalia se Nuno explicou o valor do AuditorPRO em termos de benefícios (não funcionalidades), e se usou números concretos baseados nos dados do cliente.",
      objection: "Avalia se Nuno respondeu à objeção com empatia primeiro, depois lógica — sem entrar em confronto nem ceder demasiado.",
      close: "Avalia se Nuno propôs um próximo passo concreto (data, hora, local), se o fez no momento certo, e se a conversa terminou com compromisso claro.",
    };

    const prompt = `Analisa esta conversa de treino de vendas e dá feedback como um coach de vendas sénior experiente em SaaS B2B para pequenas empresas em Portugal.

PERFIL DO CLIENTE: ${profile.name} — ${profile.role}. ${profile.personality}
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
      const { res, data } = await fetchWithRetry("/anthropic/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (data.error) {
        console.error("Anthropic Error (Feedback):", data.error);
        throw new Error(data.error.message || "Erro desconhecido na API");
      }
      const raw = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setFeedback(parsed);
      setScreen("feedback");
    } catch (err) {
      console.error(err);
      alert(`Erro ao gerar feedback: ${err.message}`);
    }
    setIsLoading(false);
  };

  const reset = () => {
    setScreen("setup");
    setSelectedProfile(null);
    setSelectedObjective(null);
    setTranscript([]);
    setFeedback(null);
    setInputText("");
    window.speechSynthesis?.cancel();
  };

  const gradeColor = (g) => ({ "A+": "#00e676", A: "#69f0ae", "B+": "#ffeb3b", B: "#ffd740", C: "#ff9800", D: "#f44336" }[g] || "#fff");

  // ===================== SCREENS =====================

  if (screen === "setup") {
    return (
      <div style={styles.root}>
        <div style={styles.header}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: -20 }}>
            <button onClick={() => setShowSettings(!showSettings)} style={styles.iconBtn}>
              ⚙️
            </button>
          </div>
          <div style={styles.logo}>RCM</div>
          <h1 style={styles.title}>Sales Training</h1>
          <p style={styles.subtitle}>Treina a tua abordagem antes de falar com clientes reais</p>
        </div>

        {showSettings && (
          <div style={styles.settingsPanel}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Anthropic API Key</div>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={styles.input}
            />
            <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>A chave é guardada apenas no teu browser (localStorage).</div>
          </div>
        )}

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
                <div style={{ 
                  fontSize: 10, 
                  color: "#555", 
                  marginTop: 6, 
                  fontStyle: "italic",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: 6
                }}>
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
      <div style={styles.root}>
        <div style={{ ...styles.sessionBar, borderColor: profile.color }}>
          <div>
            <span style={{ fontSize: 20 }}>{profile.avatar}</span>{" "}
            <span style={{ color: profile.color, fontWeight: 700 }}>{profile.name}</span>{" "}
            <span style={styles.roleTag}>{profile.role}</span>
          </div>
          <div style={styles.objTag}>
            {obj.icon} {obj.label}
          </div>
        </div>

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

        <div style={styles.inputArea}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escreve ou usa o microfone…"
            style={styles.input}
          />
          {speechSupported && (
            <button
              onClick={toggleListening}
              style={{ ...styles.iconBtn, background: isListening ? "#c0392b" : "rgba(255,255,255,0.08)" }}
              title="Clica para falar / parar"
            >
              {isListening ? "🔴" : "🎙️"}
            </button>
          )}
          <button onClick={sendMessage} disabled={isLoading} style={styles.sendBtn}>
            ➤
          </button>
        </div>

        <div style={styles.actions}>
          <button onClick={reset} style={styles.btnSecondary}>← Recomeçar</button>
          <button onClick={getFeedback} disabled={transcript.length < 4 || isLoading} style={{ ...styles.btnPrimary, opacity: transcript.length < 4 ? 0.4 : 1 }}>
            📊 Ver Feedback
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
            onClick={() => {
              setFeedback(null);
              setTranscript([]);
              const profile = PROFILES.find((p) => p.id === selectedProfile);
              const intro = `Olá. Sou ${profile.name}. ${profile.context}`;
              setTranscript([{ role: "client", text: intro }]);
              speak(intro);
              setScreen("session");
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
  settingsPanel: {
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "16px",
    marginBottom: "20px",
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
