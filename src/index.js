const { buildMetaSummary, getMetaForMode, normalizeMode } = require('./metaService');

function inferArchetype(deckName = '') {
  const text = deckName.toLowerCase();
  if (text.includes('hog') || text.includes('royal giant') || text.includes('giant')) return 'push pesado';
  if (text.includes('cycle') || text.includes('miner') || text.includes('tornado')) return 'controle e ciclo';
  if (text.includes('beatdown') || text.includes('tank') || text.includes('pekka')) return 'beatdown';
  if (text.includes('poison') || text.includes('spell') || text.includes('mortar')) return 'controle de área';
  return 'misto';
}

function describeDeckStrategy(deckName = 'Deck principal', mode = 'Ladder', enemyDeck = '') {
  const normalizedMode = normalizeMode(mode);
  const metaSummary = buildMetaSummary(normalizedMode);
  const archetype = inferArchetype(deckName);
  const enemyText = enemyDeck ? ` contra ${enemyDeck}` : '';

  return `Estratégia do deck ${deckName}${enemyText} no modo ${normalizedMode}:

- Arquétipo principal: ${archetype}.
- Objetivo da partida: criar pressão cedo e transformar qualquer resposta defensiva do adversário em oportunidade de troca positiva.
- Como vencer: mantém a linha de jogo previsível, força o rival a gastar recursos para defender e aproveita a menor janela de resposta para ganhar valor.
- Como incomodar o adversário: pressiona em duas frentes, usa o ciclo para forçar a reação, e sempre mantém uma ameaça em jogo que obrigue o oponente a defender antes de atacar.
- Ajuste para o meta: ${metaSummary}
`;
}

function buildPersonalizedPlan({ playerDeck, enemyDeck, mode, metaSummary }) {
  const normalizedMode = normalizeMode(mode);
  const currentMeta = metaSummary || buildMetaSummary(normalizedMode);
  const player = playerDeck || 'Deck principal';
  const enemy = enemyDeck || 'Deck do adversário';

  return `Plano personalizado (${normalizedMode}) para ${player} vs ${enemy}:

1. Começo: invade o centro com pressão inicial e tenta criar uma rota que force o adversário a responder antes do ciclo do seu deck ficar forte.
2. Estratégia para vencer: priorize a troca positiva e mantenha a ameaça principal sempre ativa. O objetivo é transformar cada defesa do rival em perda de tempo e em pressão que você possa aproveitar.
3. Como incomodar o adversário: faça atuções em duas frentes, interrompa a resposta do inimigo com cartas de suporte e force a troca em momentos que o deixem sem tempo para se estabilizar.
4. Resposta à defesa: quando o adversário se defender, avance com volume de dano ou suporte para quebrar a lógica de resposta.
5. Meta atual: ${currentMeta}
`;
}

module.exports = {
  inferArchetype,
  describeDeckStrategy,
  buildPersonalizedPlan,
};
