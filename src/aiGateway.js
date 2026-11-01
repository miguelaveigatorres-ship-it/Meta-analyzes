const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeMode, buildMetaSummary } = require('../src/metaService');
const { buildPersonalizedPlan, describeDeckStrategy } = require('../src/strategies');
const { buildFallbackPlan } = require('../src/aiGateway');

test('normalizeMode maps aliases to the canonical meta mode', () => {
  assert.equal(normalizeMode('ladder'), 'Ladder');
  assert.equal(normalizeMode('20wins'), '20 Wins');
  assert.equal(normalizeMode('2x2'), '2x2');
});

test('meta summary contains the deck list and win rate', () => {
  const summary = buildMetaSummary('Ladder');
  assert.match(summary, /Cycle Control/);
  assert.match(summary, /58%/);
});

test('strategy explanations cover pressure and how to annoy the enemy', () => {
  const explanation = describeDeckStrategy('Beatdown', 'Ladder', 'Hog Rider');
  assert.match(explanation, /Como incomodar o adversário/);
  assert.match(explanation, /pressiona/);
});

test('fallback plan includes the deck matchup and meta guidance', () => {
  const plan = buildFallbackPlan({
    playerDeck: 'Cycle Control',
    enemyDeck: 'Hog Rider',
    mode: 'Ladder',
    metaSummary: 'Meta atual em Ladder',
  });

  assert.match(plan, /Cycle Control/);
  assert.match(plan, /Hog Rider/);
  assert.match(plan, /Meta atual/);
});

test('personalized plan is generated with mode context', () => {
  const plan = buildPersonalizedPlan({
    playerDeck: 'Beatdown',
    enemyDeck: 'Cycle Control',
    mode: 'Clássico',
  });

  assert.match(plan, /Beatdown/);
  assert.match(plan, /Cycle Control/);
  assert.match(plan, /Clássico/);
});
