const { META_REFRESH_INTERVAL_MS } = require('./config');

const MODE_ALIASES = {
  ladder: 'Ladder',
  classic: 'Clássico',
  '20 wins': '20 Wins',
  '20wins': '20 Wins',
  '2x2': '2x2',
  '2x2-2v2': '2x2',
  desafios: 'Outros desafios',
  'outros desafios': 'Outros desafios',
  tournament: 'Torneios',
  torneio: 'Torneios',
};

const META_DATA = {
  Ladder: {
    title: 'Meta Ladder',
    decks: [
      { name: 'Cycle Control', winRate: '58%', description: 'Pressão lenta com tropa de suporte e controle de arena central para prolongar a partida.' },
      { name: 'Beatdown', winRate: '55%', description: 'Empurra o caminho a partir da torre, aproveita o tempo e o tank para forçar a defesa.' },
      { name: 'P.E.K.K.A. Bridge Spam', winRate: '52%', description: 'Recupera pressão após a primeira defesa e exagera na rota de spawn para ganhar vantagem.' },
    ],
  },
  'Clássico': {
    title: 'Meta Clássico',
    decks: [
      { name: 'Hog Rider Cycle', winRate: '57%', description: 'Explora ciclismo rápido e pressão em canais para alcançar o ciclo de vitória.' },
      { name: 'Giant Double', winRate: '54%', description: 'A linha de defesa cria oportunidades de troca e empurra o núcleo de dano.' },
      { name: 'Miner Control', winRate: '53%', description: 'Cria ambiguidade com suporte e exigência de resposta antecipada.' },
    ],
  },
  '20 Wins': {
    title: 'Meta 20 Wins',
    decks: [
      { name: 'Tornado Control', winRate: '60%', description: 'Restaura as linhas de defesa com controle atmosférico e avanço constante de pressão.' },
      { name: 'Royal Giant', winRate: '56%', description: 'Empurra bloqueio de rota e usa o tank para criar território.' },
      { name: 'Mortar Poison', winRate: '54%', description: 'Ganha espaço com dano em área e troca de cartas.' },
    ],
  },
  '2x2': {
    title: 'Meta 2x2',
    decks: [
      { name: '2x2 Control', winRate: '59%', description: 'Foca em pressão disfarçada e respostas em sincronização para controlar o centro.' },
      { name: '2x2 Mini Tank', winRate: '56%', description: 'Força entradas em compressão com apoio de suporte alto e controla o tempo.' },
      { name: '2x2 Cycle', winRate: '55%', description: 'Mantém ganho de valor e troca em alta taxa.' },
    ],
  },
  'Outros desafios': {
    title: 'Meta Outros desafios',
    decks: [
      { name: 'Big Spell', winRate: '58%', description: 'Usa feitiços de área para limpar e explorar o tempo de resposta.' },
      { name: 'Fast Cycle', winRate: '55%', description: 'Masca a defesa com pressão muito rápida e troca em alta frequência.' },
      { name: 'Anti-Air', winRate: '52%', description: 'Se aproveita de cartas de resposta para interromper a rota rápida e controlar a arena.' },
    ],
  },
  Torneios: {
    title: 'Meta Torneios',
    decks: [
      { name: 'All-in Bomb', winRate: '61%', description: 'Empurra em duas fases para impor dano ativo e quebrar a resposta.' },
      { name: 'Control Ladder', winRate: '57%', description: 'Controle de arena e rota de dano em massa para manter pressão constante.' },
      { name: 'Dual Win Condition', winRate: '54%', description: 'Alterna ameaças para confundir a defesa do adversário.' },
    ],
  },
};

function normalizeMode(input = 'Ladder') {
  const key = String(input || 'Ladder').trim().toLowerCase();
  return MODE_ALIASES[key] || input || 'Ladder';
}

function getMetaForMode(mode = 'Ladder') {
  const normalized = normalizeMode(mode);
  return META_DATA[normalized] || META_DATA.Ladder;
}

function buildMetaSummary(mode = 'Ladder') {
  const meta = getMetaForMode(mode);
  const summary = meta.decks
    .map((deck) => `- ${deck.name}: ${deck.winRate} de taxa de vitória; ${deck.description}`)
    .join('\n');

  return `Meta atual em ${meta.title}:\n${summary}`;
}

function getMetaRefreshMs() {
  return META_REFRESH_INTERVAL_MS;
}

module.exports = {
  normalizeMode,
  getMetaForMode,
  buildMetaSummary,
  getMetaRefreshMs,
  META_DATA,
};
