const { AI_GATEWAY_API_KEY, AI_GATEWAY_BASE_URL, AI_GATEWAY_MODEL } = require('./config');
const { buildMetaSummary } = require('./metaService');

async function callAiGateway({ prompt }) {
  const apiKey = AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = String(AI_GATEWAY_BASE_URL || '').replace(/\/$/, '');
  if (!baseUrl) {
    return null;
  }

  try {
    const isGoogleFormat = /googleapis|generativelanguage|gemini/i.test(baseUrl);
    const url = isGoogleFormat ? `${baseUrl}/models/${AI_GATEWAY_MODEL || 'gemini-2.5-flash'}:generateContent` : `${baseUrl}/chat/completions`;

    const payload = isGoogleFormat
      ? {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }
      : {
          model: AI_GATEWAY_MODEL || 'gpt-4o-mini',
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isGoogleFormat
          ? { 'x-goog-api-key': apiKey }
          : { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (isGoogleFormat) {
      return data.candidates?.[0]?.content?.parts?.map((item) => item.text || '').join('\n') || null;
    }

    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('AI Gateway error:', error.message);
    return null;
  }
}

function buildFallbackPlan({ playerDeck, enemyDeck, mode, metaSummary }) {
  const deck = playerDeck || 'Deck de pressão';
  const enemy = enemyDeck || 'deck inesperado';
  const metaText = metaSummary || buildMetaSummary(mode);

  return `Plano de jogo para ${deck} vs ${enemy} em ${mode}:

1. Estratégia principal: abuse do ciclo e da pressão inicial para forçar a resposta do adversário antes que ele consiga estabilizar.
2. Como incomodar o adversário: aplique pressão em duas frentes, forçando trocas ruins, e force a decisão de defesa em momentos onde o tempo e o ciclo te favorecem.
3. Defesa: nunca permita que o inimigo ganhe um trade positivo sem resposta; sempre mantenha cartas em progresso e faça trocas de valor.
4. Ajustes de meta: ${metaText}
5. Recomendação final: foque em iniciar com a linha de pressão certa e, quando o rival responder de forma defensiva, transforme o centro em ameaça constante para quebrar a defesa.
`;
}

async function generateDeckPlan({ playerDeck, enemyDeck, mode, metaSummary }) {
  const normalizedMode = String(mode || 'Ladder');
  const currentMetaSummary = metaSummary || buildMetaSummary(normalizedMode);
  const prompt = `Você é um analista de Clash Royale. Crie um plano de jogo personalizado com base no deck do jogador e no deck inimigo.

Dados:
- Deck do jogador: ${playerDeck || 'Deck não informado'}
- Deck do adversário: ${enemyDeck || 'Deck não informado'}
- Modo: ${normalizedMode}
- Meta atual: ${currentMetaSummary}

Regra: sempre explique a estratégia principal para vencer o deck, como incomodar o adversário e qual linha de jogo deve ser usada para ganhar.

Responda em português do Brasil, razoavelmente curto, porém estratégico e prático.`;

  const aiText = await callAiGateway({ prompt });
  if (aiText) {
    return aiText.trim();
  }

  return buildFallbackPlan({ playerDeck, enemyDeck, mode: normalizedMode, metaSummary: currentMetaSummary });
}

module.exports = {
  generateDeckPlan,
  buildFallbackPlan,
};
