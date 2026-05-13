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
    profiles: "const PROFILES = [\n" +
"  {\n" +
"    id: 'manuel', name: 'Manuel Ferreira', role: 'Proprietário a vender', location: 'Porto',\n" +
"    avatar: '👴', color: '#c0392b', voiceId: 'yoZ06aMxZJJ28mfd3POQ',\n" +
"    pain: 'Quer vender rápido (precisa do dinheiro para herança), mas não quer dar a casa.',\n" +
"    objections: ['Já tenho 3 agências a tratar disso', 'Exclusividade? Nem pensar', '6% de comissão é um roubo', 'Vocês só querem a comissão', 'Já me disseram que valia 280k e não venderam'],\n" +
"    personality: 'Cansado de agentes, sarcástico, faz perguntas antes de deixar falar.',\n" +
"    context: 'Colocou anúncio no Idealista há 2 semanas. Já recebeu 7 chamadas de agentes.',\n" +
"    specificData: { orcamento: 'N/A', objetivo_venda: 'Rápido, mas preço justo', tipo_imovel: 'Apartamento Herdado' }\n" +
"  },\n" +
"  {\n" +
"    id: 'sofia', name: 'Sofia Antunes', role: 'Compradora indecisa', location: 'Lisboa',\n" +
"    avatar: '👩', color: '#8e44ad', voiceId: 'EXAVITQu4vr4xnSDxMaL',\n" +
"    pain: 'Tem medo de se comprometer. O marido e ela não estão totalmente alinhados.',\n" +
"    objections: ['Está muito giro mas temos mais para ver', 'A outra agência tem um parecido mais barato', 'Precisamos de falar os dois com calma', 'Não temos pressa, o mercado vai baixar', 'Posso contactar o proprietário?'],\n" +
"    personality: 'Simpática mas evasiva. Diz sempre vamos pensar. Usa outras agências como escudo.',\n" +
"    context: 'Está a ver imóveis há 4 meses. Acaba de visitar um T2 contigo.',\n" +
"    specificData: { orcamento: '350.000€', tipologia_desejada: 'T2 com varanda', situacao: 'Crédito pré-aprovado' }\n" +
"  },\n" +
"  {\n" +
"    id: 'ricardo', name: 'Ricardo Neves', role: 'Proprietário resistente', location: 'Braga',\n" +
"    avatar: '🧔', color: '#2980b9', voiceId: 'VR6AewLTigWG4xSOukaG',\n" +
"    pain: 'Casa no mercado há 3 meses sem propostas. Preço acima do mercado.',\n" +
"    objections: ['Com exclusividade perdem a motivação', 'Vi casas iguais por 320k no Idealista', 'Porque hei de confiar em vocês?', '3 meses de contrato? E se não venderem?', 'A comissão baixa se eu trouxer comprador?'],\n" +
"    personality: 'Teimoso, acha que sabe mais que os agentes. Compara com o Idealista.',\n" +
"    context: 'Reunião presencial. Propões contrato de exclusividade.',\n" +
"    specificData: { preco_atual: '320.000€', preco_real_mercado: '290.000€', tempo_no_mercado: '3 meses' }\n" +
"  },\n" +
"  {\n" +
"    id: 'paulo', name: 'Paulo (Investidor)', role: 'Investidor', location: 'Lisboa',\n" +
"    avatar: '👔', color: '#2c3e50', voiceId: 'TxGEqnHWrfWFTfGW9XjX',\n" +
"    pain: 'Já teve má experiência com agente que lhe vendeu imóvel com problemas escondidos.',\n" +
"    objections: ['Qual é o yield bruto típico?', 'Trabalho com advogado próprio', 'Já tenho agentes de confiança', 'Que garantias me dão do imóvel?', 'Mandem-me portefólio que eu vejo'],\n" +
"    personality: 'Frio, calculista, foca-se na rentabilidade e due diligence.',\n" +
"    context: 'Evento de networking. Tens 5 minutos para agendar reunião.',\n" +
"    specificData: { orcamento: '1.5M€', yield_minimo: '6%', foco: 'Arrendamento de longa duração' }\n" +
"  }\n" +
"];\n",
    objectives: "const OBJECTIVES = [\n" +
"  { id: 'qualificacao', label: 'Qualificar', desc: 'Descobrir urgência e capacidade financeira', icon: '🔍' },\n" +
"  { id: 'angariacao', label: 'Angariação', desc: 'Vender exclusividade ao proprietário', icon: '📜' },\n" +
"  { id: 'fecho', label: 'Fecho de Visita', desc: 'Avançar para proposta formal', icon: '🔑' },\n" +
"];\n",
    criteria: "const CRITERIA = [\n" +
"  { id: 'hook', label: 'Empatia inicial', weight: 20 },\n" +
"  { id: 'pain', label: 'Qualificação financeira', weight: 25 },\n" +
"  { id: 'value', label: 'Foco no Cliente', weight: 20 },\n" +
"  { id: 'objection', label: 'Gestão de Objeções', weight: 20 },\n" +
"  { id: 'close', label: 'Call to Action', weight: 15 },\n" +
"];\n",
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
"O vendedor chama-se Nuno e é um Consultor Imobiliário experiente.`;\n",
    objectiveCriteria: "const objectiveCriteria = {\n" +
"      qualificacao: 'Avalia se Nuno fez perguntas abertas sobre motivo de compra/venda, prazo desejado e capacidade financeira/crédito.',\n" +
"      angariacao: 'Avalia se Nuno explicou o valor da exclusividade, como o plano de marketing vai resolver a dor, sem baixar a comissão facilmente.',\n" +
"      fecho: 'Avalia se Nuno respondeu às objeções da visita e conseguiu compromisso para uma segunda visita ou apresentação de proposta.',\n" +
"    };\n",
    coachPersona: "coach de vendas imobiliárias experiente em Portugal"
  },
  {
    name: "AppFarmaceutica",
    logo: "MED",
    title: "Pharma Training",
    subtitle: "Treina a tua abordagem médica",
    profiles: "const PROFILES = [\n" +
"  {\n" +
"    id: 'alexandre', name: 'Dr. Alexandre Moura', role: 'Psiquiatra (Público)', location: 'Lisboa',\n" +
"    avatar: '🩺', color: '#c0392b', voiceId: 'pNInz6obpgDQGcFmaJgB',\n" +
"    pain: 'Sobrecarregado com doentes. Usa poucos medicamentos de confiança há anos.',\n" +
"    objections: ['Já prescrevo o da concorrência há 10 anos', 'Amostras não me convencem, isso é marketing', 'Não tenho tempo para ler mais um white paper', 'Os meus doentes não podem pagar esses preços', 'O laboratório patrocinou esse estudo'],\n" +
"    personality: 'Exausto, impaciente, valoriza dados clínicos. Odeia pitch disfarçado.',\n" +
"    context: 'Fim de consulta, tem 3 minutos antes do próximo doente.',\n" +
"    specificData: { doentes_dia: 35, molecula_preferida: 'Concorrência A', sensibilidade_preco: 'Alta' }\n" +
"  },\n" +
"  {\n" +
"    id: 'ines', name: 'Dra. Inês Carvalho', role: 'Psiquiatra (Privado)', location: 'Porto',\n" +
"    avatar: '👩‍⚕️', color: '#8e44ad', voiceId: 'ThT5KcBeYPX3keUQqHPh',\n" +
"    pain: 'Preocupada com efeitos secundários. Aberta a novidades mas exige rigor científico.',\n" +
"    objections: ['Qual o perfil de efeitos secundários?', 'Há estudos de comparação direta?', 'Já tentei com dois doentes e um descontinuou', 'Prefiro esperar mais dados de vida real'],\n" +
"    personality: 'Curiosa mas crítica. Faz perguntas difíceis e respeita quem admite limitações.',\n" +
"    context: 'Congresso médico, pausa para café. Abordagem informal.',\n" +
"    specificData: { foco_terapeutico: 'Qualidade de vida a longo prazo', doentes_privado: 'Alta classe média', uso_offlabel: 'Raro' }\n" +
"  },\n" +
"  {\n" +
"    id: 'rui', name: 'Dr. Rui Baptista', role: 'Psiquiatra (Privado)', location: 'Lisboa',\n" +
"    avatar: '👨‍🔬', color: '#2980b9', voiceId: 'VR6AewLTigWG4xSOukaG',\n" +
"    pain: 'Tem doentes estabilizados e não quer arriscar mudanças.',\n" +
"    objections: ['Não usei as amostras, doentes estabilizados', 'Para quem prescreveria isto especificamente?', 'E interações medicamentosas?', 'Fala com a minha secretária para a próxima'],\n" +
"    personality: 'Conservador, pragmático. Não é hostil mas é difícil de mover.',\n" +
"    context: 'Segunda visita após deixares amostras há 3 semanas.',\n" +
"    specificData: { idade_media_doentes: 55, foco: 'Segurança', amostras_usadas: 0 }\n" +
"  },\n" +
"  {\n" +
"    id: 'catarina', name: 'Dra. Catarina Sousa', role: 'Diretora Farmácia Hospitalar', location: 'Central',\n" +
"    avatar: '🗂️', color: '#2c3e50', voiceId: 'EXAVITQu4vr4xnSDxMaL',\n" +
"    pain: 'Pressão para reduzir custos. Tem de justificar adições ao formulário.',\n" +
"    objections: ['O genérico é 40% mais barato', 'Qual é o custo por dia de tratamento?', 'Temos quota esgotada este ano', 'Precisamos de estudos de farmacoeconomia'],\n" +
"    personality: 'Analítica, focada em custo-efetividade. Tem poder de bloqueio.',\n" +
"    context: 'Reunião de 15 minutos para inclusão no formulário hospitalar.',\n" +
"    specificData: { orcamento_anual: 'Controlado', criterio_principal: 'Custo-Efetividade', tempo_aprovacao: '6 meses' }\n" +
"  }\n" +
"];\n",
    objectives: "const OBJECTIVES = [\n" +
"  { id: 'abertura', label: 'Abertura Clínica', desc: 'Despertar interesse em 3 min', icon: '⏱️' },\n" +
"  { id: 'estudo', label: 'Apresentação Científica', desc: 'Provar eficácia e segurança', icon: '📊' },\n" +
"  { id: 'fecho', label: 'Compromisso', desc: 'Conseguir promessa de prescrição/teste', icon: '🤝' },\n" +
"];\n",
    criteria: "const CRITERIA = [\n" +
"  { id: 'hook', label: 'Rigor Científico', weight: 25 },\n" +
"  { id: 'pain', label: 'Respeito pelo Tempo', weight: 20 },\n" +
"  { id: 'value', label: 'Foco no Doente', weight: 20 },\n" +
"  { id: 'objection', label: 'Resposta a Objeções Clínicas', weight: 20 },\n" +
"  { id: 'close', label: 'Fecho', weight: 15 },\n" +
"];\n",
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
"O vendedor chama-se Nuno e é Delegado de Propaganda Médica a lançar um novo fármaco para o SNC (Sistema Nervoso Central).`;\n",
    objectiveCriteria: "const objectiveCriteria = {\n" +
"      abertura: 'Avalia se Nuno captou a atenção rapidamente sem rodeios, usando um angle clínico relevante.',\n" +
"      estudo: 'Avalia se Nuno explicou o perfil de eficácia/segurança usando dados reais em vez de adjetivos vagos.',\n" +
"      fecho: 'Avalia se Nuno propôs um próximo passo claro (ex: experimentar num perfil específico de doente) e geriu a resistência final.',\n" +
"    };\n",
    coachPersona: "Medical Sales Coach experiente"
  },
  {
    name: "AppAutomovel",
    logo: "EV",
    title: "EV Training",
    subtitle: "Treina a venda de automóveis elétricos",
    profiles: "const PROFILES = [\n" +
"  {\n" +
"    id: 'carla', name: 'Carla Mendonça', role: 'Mãe, uso familiar', location: 'Aveiro',\n" +
"    avatar: '👩‍👧', color: '#c0392b', voiceId: 'EXAVITQu4vr4xnSDxMaL',\n" +
"    pain: 'Quer reduzir custos mas tem medo da autonomia e de ficar presa na autoestrada.',\n" +
"    objections: ['E se a bateria acabar na A1?', 'Onde carrego? Aqui há poucos pontos', 'O meu marido prefere gasóleo', 'As baterias ficam más ao fim de 3 anos', 'O preço é muito alto'],\n" +
"    personality: 'Prática, desconfiada de tecnologia nova. Decide em casal.',\n" +
"    context: 'Entrou no showroom. Só quer ver.',\n" +
"    specificData: { km_dia: 30, ferias_ano: 'Algarve (1x)', orcamento: '40.000€', viatura_atual: 'Diesel 2012' }\n" +
"  },\n" +
"  {\n" +
"    id: 'diogo', name: 'Eng. Diogo Fonseca', role: 'Quadro Técnico', location: 'Lisboa',\n" +
"    avatar: '🧑‍💻', color: '#2980b9', voiceId: 'TxGEqnHWrfWFTfGW9XjX',\n" +
"    pain: 'Quer tomar a decisão certa. Compara specs ao detalhe.',\n" +
"    objections: ['O Tesla Model Y tem mais autonomia', 'Qual a degradação real ao fim de 100k km?', 'Qual o WLTP real a 120km/h?', 'Software OTA é pago?', 'Vou esperar o próximo modelo'],\n" +
"    personality: 'Analítico, pesquisou muito, testa o vendedor com perguntas técnicas.',\n" +
"    context: 'Acabou o test drive. Está interessado mas vai pensar.',\n" +
"    specificData: { km_dia: 60, spreadsheet_criada: 'Sim', orcamento: '55.000€', foco: 'Tecnologia/Specs' }\n" +
"  },\n" +
"  {\n" +
"    id: 'augusto', name: 'Sr. Augusto', role: 'Empresário', location: 'Coimbra',\n" +
"    avatar: '👴', color: '#2c3e50', voiceId: 'yoZ06aMxZJJ28mfd3POQ',\n" +
"    pain: 'Habituado a Mercedes diesel. Não está convencido com elétricos para frotas.',\n" +
"    objections: ['Para Lisboa-Porto não serve', 'Benefícios fiscais não compensam', '3 carros é muito risco', 'Preferia híbrido'],\n" +
"    personality: 'Old school, confia em marcas alemãs. Focado no negócio.',\n" +
"    context: 'Chamada telefónica para fechar proposta enviada há 1 semana para 3 carros.',\n" +
"    specificData: { frota_atual: 'Diesel', viagens_longas: 'Frequentes', prioridade: 'TCO (Total Cost of Ownership)' }\n" +
"  },\n" +
"  {\n" +
"    id: 'mariana', name: 'Mariana Silva', role: 'Primeiro carro próprio', location: 'Porto',\n" +
"    avatar: '👩‍🎓', color: '#27ae60', voiceId: 'ThT5KcBeYPX3keUQqHPh',\n" +
"    pain: 'Quer elétrico mas acha que não pode pagar nem carregar no apartamento.',\n" +
"    objections: ['É muito caro, nem pergunto', 'Moro num apartamento, não posso carregar', 'Seguros são mais caros?', 'Vou esperar que os preços baixem'],\n" +
"    personality: 'Entusiasmada com sustentabilidade mas travada pelo preço.',\n" +
"    context: 'Feira automóvel. Para no stand por curiosidade com uma amiga.',\n" +
"    specificData: { orcamento: 'Prestação < 300€', garagem: 'Não tem', prioridade: 'Sustentabilidade/Design' }\n" +
"  }\n" +
"];\n",
    objectives: "const OBJECTIVES = [\n" +
"  { id: 'descoberta', label: 'Descoberta', desc: 'Uso familiar vs profissional', icon: '🔍' },\n" +
"  { id: 'desmistificar', label: 'Desmistificar EVs', desc: 'Vencer medos de autonomia/carregamento', icon: '⚡' },\n" +
"  { id: 'fecho', label: 'Agendamento', desc: 'Agendar Test Drive ou Proposta', icon: '🚗' },\n" +
"];\n",
    criteria: "const CRITERIA = [\n" +
"  { id: 'hook', label: 'Empatia', weight: 20 },\n" +
"  { id: 'pain', label: 'Descoberta de Necessidades', weight: 25 },\n" +
"  { id: 'value', label: 'Conhecimento Técnico EV', weight: 20 },\n" +
"  { id: 'objection', label: 'Desconstrução de Medos', weight: 20 },\n" +
"  { id: 'close', label: 'Fecho', weight: 15 },\n" +
"];\n",
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
"O vendedor chama-se Nuno e é um Comercial Automóvel de uma marca de Veículos Elétricos.`;\n",
    objectiveCriteria: "const objectiveCriteria = {\n" +
"      descoberta: 'Avalia se Nuno fez perguntas sobre quilometragem diária, possibilidade de carregamento em casa/trabalho e orçamento.',\n" +
"      desmistificar: 'Avalia se Nuno conseguiu explicar o carregamento ou a autonomia de forma simples, sem jargão excessivo e focada no uso real do cliente.',\n" +
"      fecho: 'Avalia se Nuno propôs o test drive ou a criação de uma simulação de financiamento no momento adequado.',\n" +
"    };\n",
    coachPersona: "Coach de Vendas Automóvel especializado em Veículos Elétricos"
  }
];

function replaceBetween(str, startStr, endStr, replacement) {
  const startIdx = str.indexOf(startStr);
  if (startIdx === -1) throw new Error('Start ' + startStr + ' not found');
  
  let endIdx = str.indexOf(endStr, startIdx + startStr.length);
  if (endIdx === -1) throw new Error('End ' + endStr + ' not found');
  
  return str.substring(0, startIdx) + replacement + str.substring(endIdx);
}

const outDir = path.join(__dirname, '../src');

apps.forEach(app => {
  let newContent = content;

  // Replace export
  newContent = newContent.replace('export default function AppRCM() {', 'export default function ' + app.name + '() {');
  newContent = newContent.replace('export default function App() {', 'export default function ' + app.name + '() {');

  // Replace blocks
  newContent = replaceBetween(newContent, 'const PROFILES = [', 'const OBJECTIVES = [', app.profiles);
  newContent = replaceBetween(newContent, 'const OBJECTIVES = [', 'const CRITERIA = [', app.objectives);
  newContent = replaceBetween(newContent, 'const CRITERIA = [', '// --- MAIN COMPONENT ---', app.criteria);

  // Replace System Prompt
  newContent = replaceBetween(newContent, 'const systemPrompt = `', '    const messages =', app.systemPrompt);

  // Replace Feedback Criteria
  newContent = replaceBetween(newContent, 'const objectiveCriteria = {', '    const prompt = `Analisa', app.objectiveCriteria);

  // Replace Coach Persona
  const coachPromptStart = 'Analisa esta conversa de treino de vendas e dá feedback como um ';
  newContent = replaceBetween(newContent, coachPromptStart, 'PERFIL DO CLIENTE:', 'Analisa esta conversa de treino de vendas e dá feedback como um ' + app.coachPersona + '.\\n\\n');

  // Replace UI Strings
  newContent = newContent.replace('<div style={styles.logo}>RCM</div>', '<div style={styles.logo}>' + app.logo + '</div>');
  newContent = newContent.replace('<h1 style={styles.title}>Sales Training</h1>', '<h1 style={styles.title}>' + app.title + '</h1>');
  newContent = newContent.replace('Treina a tua abordagem antes de falar com clientes reais', app.subtitle);

  fs.writeFileSync(path.join(outDir, app.name + '.jsx'), newContent);
  console.log('Generated ' + app.name + '.jsx');
});
