const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/AppRCM.jsx');
const content = fs.readFileSync(srcPath, 'utf8');

const apps = [
  {
    name: "AppImobiliaria",
    logo: "IMO",
    title: "Imobiliária Training",
    subtitle: "Treina a tua abordagem de angariação e venda de imóveis",
    profiles: "const PROFILES = [" +
"  {" +
"    id: 'manuel', name: 'Manuel Ferreira', role: 'Proprietário a vender', location: 'Porto'," +
"    avatar: '👴', color: '#c0392b', voiceId: 'yoZ06aMxZJJ28mfd3POQ'," +
"    pain: 'Quer vender rápido (precisa do dinheiro para herança), mas não quer dar a casa.'," +
"    objections: ['Já tenho 3 agências a tratar disso', 'Exclusividade? Nem pensar', '6% de comissão é um roubo', 'Vocês só querem a comissão', 'Já me disseram que valia 280k e não venderam']," +
"    personality: 'Cansado de agentes, sarcástico, faz perguntas antes de deixar falar.'," +
"    context: 'Colocou anúncio no Idealista há 2 semanas. Já recebeu 7 chamadas de agentes.'," +
"    specificData: { orcamento: 'N/A', objetivo_venda: 'Rápido, mas preço justo', tipo_imovel: 'Apartamento Herdado' }" +
"  }," +
"  {" +
"    id: 'sofia', name: 'Sofia Antunes', role: 'Compradora indecisa', location: 'Lisboa'," +
"    avatar: '👩', color: '#8e44ad', voiceId: 'EXAVITQu4vr4xnSDxMaL'," +
"    pain: 'Tem medo de se comprometer. O marido e ela não estão totalmente alinhados.'," +
"    objections: ['Está muito giro mas temos mais para ver', 'A outra agência tem um parecido mais barato', 'Precisamos de falar os dois com calma', 'Não temos pressa, o mercado vai baixar', 'Posso contactar o proprietário?']," +
"    personality: 'Simpática mas evasiva. Diz sempre vamos pensar. Usa outras agências como escudo.'," +
"    context: 'Está a ver imóveis há 4 meses. Acaba de visitar um T2 contigo.'," +
"    specificData: { orcamento: '350.000€', tipologia_desejada: 'T2 com varanda', situacao: 'Crédito pré-aprovado' }" +
"  }," +
"  {" +
"    id: 'ricardo', name: 'Ricardo Neves', role: 'Proprietário resistente', location: 'Braga'," +
"    avatar: '🧔', color: '#2980b9', voiceId: 'VR6AewLTigWG4xSOukaG'," +
"    pain: 'Casa no mercado há 3 meses sem propostas. Preço acima do mercado.'," +
"    objections: ['Com exclusividade perdem a motivação', 'Vi casas iguais por 320k no Idealista', 'Porque hei de confiar em vocês?', '3 meses de contrato? E se não venderem?', 'A comissão baixa se eu trouxer comprador?']," +
"    personality: 'Teimoso, acha que sabe mais que os agentes. Compara com o Idealista.'," +
"    context: 'Reunião presencial. Propões contrato de exclusividade.'," +
"    specificData: { preco_atual: '320.000€', preco_real_mercado: '290.000€', tempo_no_mercado: '3 meses' }" +
"  }," +
"  {" +
"    id: 'paulo', name: 'Paulo (Investidor)', role: 'Investidor', location: 'Lisboa'," +
"    avatar: '👔', color: '#2c3e50', voiceId: 'TxGEqnHWrfWFTfGW9XjX'," +
"    pain: 'Já teve má experiência com agente que lhe vendeu imóvel com problemas escondidos.'," +
"    objections: ['Qual é o yield bruto típico?', 'Trabalho com advogado próprio', 'Já tenho agentes de confiança', 'Que garantias me dão do imóvel?', 'Mandem-me portefólio que eu vejo']," +
"    personality: 'Frio, calculista, foca-se na rentabilidade e due diligence.'," +
"    context: 'Evento de networking. Tens 5 minutos para agendar reunião.'," +
"    specificData: { orcamento: '1.5M€', yield_minimo: '6%', foco: 'Arrendamento de longa duração' }" +
"  }" +
"];",
    objectives: "const OBJECTIVES = [" +
"  { id: 'qualificacao', label: 'Qualificar', desc: 'Descobrir urgência e capacidade financeira', icon: '🔍' }," +
"  { id: 'angariacao', label: 'Angariação', desc: 'Vender exclusividade ao proprietário', icon: '📜' }," +
"  { id: 'fecho', label: 'Fecho de Visita', desc: 'Avançar para proposta formal', icon: '🔑' }," +
"];",
    criteria: "const CRITERIA = [" +
"  { id: 'hook', label: 'Empatia inicial', weight: 20 }," +
"  { id: 'pain', label: 'Qualificação financeira', weight: 25 }," +
"  { id: 'value', label: 'Foco no Cliente', weight: 20 }," +
"  { id: 'objection', label: 'Gestão de Objeções', weight: 20 }," +
"  { id: 'close', label: 'Call to Action', weight: 15 }," +
"];",
    systemPrompt: "const systemPrompt = `És ${profile.name}, ${profile.role} em ${profile.location}.\\n" +
"Personalidade: ${profile.personality}\\n" +
"Contexto: ${profile.context}\\n" +
"Dor principal: ${profile.pain}\\n" +
"Objeção típica: ${profile.objections.join(', ')}\\n\\n" +
"DADOS ESPECÍFICOS (só revelares se perguntado diretamente):\\n" +
"${Object.entries(profile.specificData).map(([k, v]) => `- ${k}: ${v}`).join('\\n')}\\n\\n" +
"REGRAS DE COMPORTAMENTO:\\n" +
"- És uma pessoa real e não facilitas a vida ao consultor imobiliário.\\n" +
"- Só respondes ao que te perguntam.\\n" +
"- Se o consultor for vago, tentas despachá-lo.\\n" +
"- Se o consultor fizer uma boa pergunta, respondes com um pouco mais de detalhe.\\n" +
"- Levantas a objeção típica naturalmente.\\n" +
"- Mantém respostas curtas: 2 a 3 frases no máximo.\\n" +
"- Fala em português coloquial de Portugal.\\n\\n" +
"O vendedor chama-se Nuno e é um Consultor Imobiliário experiente.`;",
    objectiveCriteria: "const objectiveCriteria = {" +
"      qualificacao: 'Avalia se Nuno fez perguntas abertas sobre motivo de compra/venda, prazo desejado e capacidade financeira/crédito.'," +
"      angariacao: 'Avalia se Nuno explicou o valor da exclusividade, como o plano de marketing vai resolver a dor, sem baixar a comissão facilmente.'," +
"      fecho: 'Avalia se Nuno respondeu às objeções da visita e conseguiu compromisso para uma segunda visita ou apresentação de proposta.'," +
"    };",
    coachPersona: "coach de vendas imobiliárias experiente em Portugal"
  },
  {
    name: "AppFarmaceutica",
    logo: "MED",
    title: "Pharma Training",
    subtitle: "Treina a tua abordagem médica",
    profiles: "const PROFILES = [" +
"  {" +
"    id: 'alexandre', name: 'Dr. Alexandre Moura', role: 'Psiquiatra (Público)', location: 'Lisboa'," +
"    avatar: '🩺', color: '#c0392b', voiceId: 'pNInz6obpgDQGcFmaJgB'," +
"    pain: 'Sobrecarregado com doentes. Usa poucos medicamentos de confiança há anos.'," +
"    objections: ['Já prescrevo o da concorrência há 10 anos', 'Amostras não me convencem, isso é marketing', 'Não tenho tempo para ler mais um white paper', 'Os meus doentes não podem pagar esses preços', 'O laboratório patrocinou esse estudo']," +
"    personality: 'Exausto, impaciente, valoriza dados clínicos. Odeia pitch disfarçado.'," +
"    context: 'Fim de consulta, tem 3 minutos antes do próximo doente.'," +
"    specificData: { doentes_dia: 35, molecula_preferida: 'Concorrência A', sensibilidade_preco: 'Alta' }" +
"  }," +
"  {" +
"    id: 'ines', name: 'Dra. Inês Carvalho', role: 'Psiquiatra (Privado)', location: 'Porto'," +
"    avatar: '👩‍⚕️', color: '#8e44ad', voiceId: 'ThT5KcBeYPX3keUQqHPh'," +
"    pain: 'Preocupada com efeitos secundários. Aberta a novidades mas exige rigor científico.'," +
"    objections: ['Qual o perfil de efeitos secundários?', 'Há estudos de comparação direta?', 'Já tentei com dois doentes e um descontinuou', 'Prefiro esperar mais dados de vida real']," +
"    personality: 'Curiosa mas crítica. Faz perguntas difíceis e respeita quem admite limitações.'," +
"    context: 'Congresso médico, pausa para café. Abordagem informal.'," +
"    specificData: { foco_terapeutico: 'Qualidade de vida a longo prazo', doentes_privado: 'Alta classe média', uso_offlabel: 'Raro' }" +
"  }," +
"  {" +
"    id: 'rui', name: 'Dr. Rui Baptista', role: 'Psiquiatra (Privado)', location: 'Lisboa'," +
"    avatar: '👨‍🔬', color: '#2980b9', voiceId: 'VR6AewLTigWG4xSOukaG'," +
"    pain: 'Tem doentes estabilizados e não quer arriscar mudanças.'," +
"    objections: ['Não usei as amostras, doentes estabilizados', 'Para quem prescreveria isto especificamente?', 'E interações medicamentosas?', 'Fala com a minha secretária para a próxima']," +
"    personality: 'Conservador, pragmático. Não é hostil mas é difícil de mover.'," +
"    context: 'Segunda visita após deixares amostras há 3 semanas.'," +
"    specificData: { idade_media_doentes: 55, foco: 'Segurança', amostras_usadas: 0 }" +
"  }," +
"  {" +
"    id: 'catarina', name: 'Dra. Catarina Sousa', role: 'Diretora Farmácia Hospitalar', location: 'Central'," +
"    avatar: '🗂️', color: '#2c3e50', voiceId: 'EXAVITQu4vr4xnSDxMaL'," +
"    pain: 'Pressão para reduzir custos. Tem de justificar adições ao formulário.'," +
"    objections: ['O genérico é 40% mais barato', 'Qual é o custo por dia de tratamento?', 'Temos quota esgotada este ano', 'Precisamos de estudos de farmacoeconomia']," +
"    personality: 'Analítica, focada em custo-efetividade. Tem poder de bloqueio.'," +
"    context: 'Reunião de 15 minutos para inclusão no formulário hospitalar.'," +
"    specificData: { orcamento_anual: 'Controlado', criterio_principal: 'Custo-Efetividade', tempo_aprovacao: '6 meses' }" +
"  }" +
"];",
    objectives: "const OBJECTIVES = [" +
"  { id: 'abertura', label: 'Abertura Clínica', desc: 'Despertar interesse em 3 min', icon: '⏱️' }," +
"  { id: 'estudo', label: 'Apresentação Científica', desc: 'Provar eficácia e segurança', icon: '📊' }," +
"  { id: 'fecho', label: 'Compromisso', desc: 'Conseguir promessa de prescrição/teste', icon: '🤝' }," +
"];",
    criteria: "const CRITERIA = [" +
"  { id: 'hook', label: 'Rigor Científico', weight: 25 }," +
"  { id: 'pain', label: 'Respeito pelo Tempo', weight: 20 }," +
"  { id: 'value', label: 'Foco no Doente', weight: 20 }," +
"  { id: 'objection', label: 'Resposta a Objeções Clínicas', weight: 20 }," +
"  { id: 'close', label: 'Fecho', weight: 15 }," +
"];",
    systemPrompt: "const systemPrompt = `És ${profile.name}, ${profile.role} em ${profile.location}.\\n" +
"Personalidade: ${profile.personality}\\n" +
"Contexto: ${profile.context}\\n" +
"Dor principal: ${profile.pain}\\n" +
"Objeção típica: ${profile.objections.join(', ')}\\n\\n" +
"DADOS CLÍNICOS / HOSPITALARES (só revelares se perguntado):\\n" +
"${Object.entries(profile.specificData).map(([k, v]) => `- ${k}: ${v}`).join('\\n')}\\n\\n" +
"REGRAS DE COMPORTAMENTO:\\n" +
"- És um médico/farmacêutico ocupado. Odeias discursos de vendas memorizados.\\n" +
"- Se o delegado não trouxer valor científico real, cortas a conversa.\\n" +
"- Levantas a objeção de forma direta.\\n" +
"- Mantém respostas curtas: 2 a 3 frases no máximo.\\n" +
"- Fala em português coloquial mas com termos médicos apropriados.\\n\\n" +
"O vendedor chama-se Nuno e é Delegado de Propaganda Médica a lançar um novo fármaco para o SNC (Sistema Nervoso Central).`;",
    objectiveCriteria: "const objectiveCriteria = {" +
"      abertura: 'Avalia se Nuno captou a atenção rapidamente sem rodeios, usando um angle clínico relevante.'," +
"      estudo: 'Avalia se Nuno explicou o perfil de eficácia/segurança usando dados reais em vez de adjetivos vagos.'," +
"      fecho: 'Avalia se Nuno propôs um próximo passo claro (ex: experimentar num perfil específico de doente) e geriu a resistência final.'," +
"    };",
    coachPersona: "Medical Sales Coach experiente"
  },
  {
    name: "AppAutomovel",
    logo: "EV",
    title: "EV Training",
    subtitle: "Treina a venda de automóveis elétricos",
    profiles: "const PROFILES = [" +
"  {" +
"    id: 'carla', name: 'Carla Mendonça', role: 'Mãe, uso familiar', location: 'Aveiro'," +
"    avatar: '👩‍👧', color: '#c0392b', voiceId: 'EXAVITQu4vr4xnSDxMaL'," +
"    pain: 'Quer reduzir custos mas tem medo da autonomia e de ficar presa na autoestrada.'," +
"    objections: ['E se a bateria acabar na A1?', 'Onde carrego? Aqui há poucos pontos', 'O meu marido prefere gasóleo', 'As baterias ficam más ao fim de 3 anos', 'O preço é muito alto']," +
"    personality: 'Prática, desconfiada de tecnologia nova. Decide em casal.'," +
"    context: 'Entrou no showroom. Só quer ver.'," +
"    specificData: { km_dia: 30, ferias_ano: 'Algarve (1x)', orcamento: '40.000€', viatura_atual: 'Diesel 2012' }" +
"  }," +
"  {" +
"    id: 'diogo', name: 'Eng. Diogo Fonseca', role: 'Quadro Técnico', location: 'Lisboa'," +
"    avatar: '🧑‍💻', color: '#2980b9', voiceId: 'TxGEqnHWrfWFTfGW9XjX'," +
"    pain: 'Quer tomar a decisão certa. Compara specs ao detalhe.'," +
"    objections: ['O Tesla Model Y tem mais autonomia', 'Qual a degradação real ao fim de 100k km?', 'Qual o WLTP real a 120km/h?', 'Software OTA é pago?', 'Vou esperar o próximo modelo']," +
"    personality: 'Analítico, pesquisou muito, testa o vendedor com perguntas técnicas.'," +
"    context: 'Acabou o test drive. Está interessado mas vai pensar.'," +
"    specificData: { km_dia: 60, spreadsheet_criada: 'Sim', orcamento: '55.000€', foco: 'Tecnologia/Specs' }" +
"  }," +
"  {" +
"    id: 'augusto', name: 'Sr. Augusto', role: 'Empresário', location: 'Coimbra'," +
"    avatar: '👴', color: '#2c3e50', voiceId: 'yoZ06aMxZJJ28mfd3POQ'," +
"    pain: 'Habituado a Mercedes diesel. Não está convencido com elétricos para frotas.'," +
"    objections: ['Para Lisboa-Porto não serve', 'Benefícios fiscais não compensam', '3 carros é muito risco', 'Preferia híbrido']," +
"    personality: 'Old school, confia em marcas alemãs. Focado no negócio.'," +
"    context: 'Chamada telefónica para fechar proposta enviada há 1 semana para 3 carros.'," +
"    specificData: { frota_atual: 'Diesel', viagens_longas: 'Frequentes', prioridade: 'TCO (Total Cost of Ownership)' }" +
"  }," +
"  {" +
"    id: 'mariana', name: 'Mariana Silva', role: 'Primeiro carro próprio', location: 'Porto'," +
"    avatar: '👩‍🎓', color: '#27ae60', voiceId: 'ThT5KcBeYPX3keUQqHPh'," +
"    pain: 'Quer elétrico mas acha que não pode pagar nem carregar no apartamento.'," +
"    objections: ['É muito caro, nem pergunto', 'Moro num apartamento, não posso carregar', 'Seguros são mais caros?', 'Vou esperar que os preços baixem']," +
"    personality: 'Entusiasmada com sustentabilidade mas travada pelo preço.'," +
"    context: 'Feira automóvel. Para no stand por curiosidade com uma amiga.'," +
"    specificData: { orcamento: 'Prestação < 300€', garagem: 'Não tem', prioridade: 'Sustentabilidade/Design' }" +
"  }" +
"];",
    objectives: "const OBJECTIVES = [" +
"  { id: 'descoberta', label: 'Descoberta', desc: 'Uso familiar vs profissional', icon: '🔍' }," +
"  { id: 'desmistificar', label: 'Desmistificar EVs', desc: 'Vencer medos de autonomia/carregamento', icon: '⚡' }," +
"  { id: 'fecho', label: 'Agendamento', desc: 'Agendar Test Drive ou Proposta', icon: '🚗' }," +
"];",
    criteria: "const CRITERIA = [" +
"  { id: 'hook', label: 'Empatia', weight: 20 }," +
"  { id: 'pain', label: 'Descoberta de Necessidades', weight: 25 }," +
"  { id: 'value', label: 'Conhecimento Técnico EV', weight: 20 }," +
"  { id: 'objection', label: 'Desconstrução de Medos', weight: 20 }," +
"  { id: 'close', label: 'Fecho', weight: 15 }," +
"];",
    systemPrompt: "const systemPrompt = `És ${profile.name}, ${profile.role} em ${profile.location}.\\n" +
"Personalidade: ${profile.personality}\\n" +
"Contexto: ${profile.context}\\n" +
"Dor principal: ${profile.pain}\\n" +
"Objeção típica: ${profile.objections.join(', ')}\\n\\n" +
"DADOS DO CONDUTOR (só revelares se perguntado):\\n" +
"${Object.entries(profile.specificData).map(([k, v]) => `- ${k}: ${v}`).join('\\n')}\\n\\n" +
"REGRAS DE COMPORTAMENTO:\\n" +
"- És um cliente real. Tens dúvidas legítimas sobre carros elétricos (autonomia, carregamento, preço).\\n" +
"- Não facilitas a vida ao comercial.\\n" +
"- Levantas a objeção típica naturalmente.\\n" +
"- Mantém respostas curtas: 2 a 3 frases no máximo.\\n" +
"- Fala em português coloquial.\\n\\n" +
"O vendedor chama-se Nuno e é um Comercial Automóvel de uma marca de Veículos Elétricos.`;",
    objectiveCriteria: "const objectiveCriteria = {" +
"      descoberta: 'Avalia se Nuno fez perguntas sobre quilometragem diária, possibilidade de carregamento em casa/trabalho e orçamento.'," +
"      desmistificar: 'Avalia se Nuno conseguiu explicar o carregamento ou a autonomia de forma simples, sem jargão excessivo e focada no uso real do cliente.'," +
"      fecho: 'Avalia se Nuno propôs o test drive ou a criação de uma simulação de financiamento no momento adequado.'," +
"    };",
    coachPersona: "Coach de Vendas Automóvel especializado em Veículos Elétricos"
  }
];

function replaceBetween(str, startStr, endStr, replacement) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) throw new Error('Start ' + startStr + ' not found');
  
  let endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) {
    if (endStr === null) {
      endIdx = str.length;
    } else {
      throw new Error('End ' + endStr + ' not found');
    }
  }
  
  return str.substring(0, startIdx) + replacement + str.substring(endIdx);
}

const outDir = path.join(__dirname, '../src');

apps.forEach(app => {
  let newContent = content;

  // Replace export
  newContent = newContent.replace('export default function AppRCM() {', 'export default function ' + app.name + '() {');
  newContent = newContent.replace('export default function App() {', 'export default function ' + app.name + '() {');

  // Replace PROFILES
  newContent = replaceBetween(newContent, 'const PROFILES = [', '];\\r\\n\\r\\nconst OBJECTIVES', app.profiles);

  // Replace OBJECTIVES
  newContent = replaceBetween(newContent, 'const OBJECTIVES = [', '];\\r\\n\\r\\nconst CRITERIA', app.objectives);

  // Replace CRITERIA
  newContent = replaceBetween(newContent, 'const CRITERIA = [', '];\\r\\n\\r\\n// --- MAIN COMPONENT', app.criteria);

  // Replace System Prompt
  const promptStart = 'const systemPrompt = `';
  const promptEnd = '`;\\r\\n    const messages =';
  newContent = replaceBetween(newContent, promptStart, promptEnd, app.systemPrompt);

  // Replace Feedback Criteria
  const objectiveCriteriaStart = 'const objectiveCriteria = {';
  const objectiveCriteriaEnd = '    };\\r\\n    const prompt = `Analisa';
  newContent = replaceBetween(newContent, objectiveCriteriaStart, objectiveCriteriaEnd, app.objectiveCriteria);

  // Replace Coach Persona inside the getFeedback prompt
  const coachPromptStart = 'Analisa esta conversa de treino de vendas e dá feedback como um ';
  const coachPromptEnd = '\\r\\n\\r\\nPERFIL DO CLIENTE:';
  newContent = replaceBetween(newContent, coachPromptStart, coachPromptEnd, 'Analisa esta conversa de treino de vendas e dá feedback como um ' + app.coachPersona + '.');

  // Replace UI Strings
  newContent = newContent.replace('<div style={styles.logo}>RCM</div>', '<div style={styles.logo}>' + app.logo + '</div>');
  newContent = newContent.replace('<h1 style={styles.title}>Sales Training</h1>', '<h1 style={styles.title}>' + app.title + '</h1>');
  newContent = newContent.replace('Treina a tua abordagem antes de falar com clientes reais', app.subtitle);

  fs.writeFileSync(path.join(outDir, app.name + '.jsx'), newContent);
  console.log('Generated ' + app.name + '.jsx');
});
