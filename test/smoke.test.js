const { Client, GatewayIntentBits, REST, Routes, Events, EmbedBuilder } = require('discord.js');
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = require('./config');
const { getMetaForMode, normalizeMode, buildMetaSummary } = require('./metaService');
const { describeDeckStrategy, buildPersonalizedPlan } = require('./strategies');
const { generateDeckPlan } = require('./aiGateway');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

function sanitizeTag(tag = '') {
  return String(tag || '').replace(/[#\s]/g, '').toUpperCase();
}

function createProfileSummary(tag) {
  const cleanTag = sanitizeTag(tag || 'PLAYER');
  return {
    tag: cleanTag,
    trophies: 3700,
    arena: 'Arena de Master',
    favoriteDeck: 'Cycle Control',
    mainMode: 'Ladder',
    summary: `Perfil de ${cleanTag}: nível competitivo alto, foco em pressão e troca de valor.`,
  };
}

function createDeckSummary(tag, mode = 'Ladder') {
  const normalizedMode = normalizeMode(mode);
  return {
    tag: sanitizeTag(tag || 'PLAYER'),
    mode: normalizedMode,
    deck: 'Cycle Control',
    winRate: '58%',
    bestCard: 'Tornado',
    explanation: describeDeckStrategy('Cycle Control', normalizedMode),
  };
}

client.once(Events.ClientReady, async () => {
  console.log(`Online como ${client.user.tag}`);

  if (DISCORD_TOKEN && DISCORD_CLIENT_ID) {
    const commands = [
      {
        name: 'perfil',
        description: 'Mostra o perfil do jogador no bot',
        options: [{ name: 'tag', description: 'Tag do jogador', type: 3, required: true }],
      },
      {
        name: 'deck',
        description: 'Mostra o deck principal do jogador em um modo',
        options: [
          { name: 'tag', description: 'Tag do jogador', type: 3, required: true },
          { name: 'modo', description: 'Modo de jogo', type: 3, required: true },
        ],
      },
      {
        name: 'meta',
        description: 'Mostra o meta atual do modo',
        options: [{ name: 'modo', description: 'Modo de jogo', type: 3, required: true }],
      },
      {
        name: 'atualizar',
        description: 'Atualiza o meta do bot',
      },
      {
        name: 'plano',
        description: 'Gera um plano de jogo com base no deck do jogador, no deck adversário e no meta atual',
        options: [
          { name: 'modo', description: 'Modo de jogo', type: 3, required: true },
          { name: 'deck_inimigo', description: 'Deck do adversário', type: 3, required: true },
          { name: 'deck_jogador', description: 'Deck do jogador', type: 3, required: false },
        ],
      },
    ];

    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log('[meta] pronto');
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'perfil') {
    const tag = sanitizeTag(interaction.options.getString('tag'));
    const profile = createProfileSummary(tag);
    const embed = new EmbedBuilder()
      .setColor('#00A8FC')
      .setTitle(`Perfil de ${profile.tag}`)
      .setDescription(profile.summary)
      .addFields(
        { name: 'Troféus', value: `${profile.trophies}`, inline: true },
        { name: 'Arena', value: profile.arena, inline: true },
        { name: 'Deck favorito', value: profile.favoriteDeck, inline: true },
        { name: 'Modo principal', value: profile.mainMode, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (commandName === 'deck') {
    const tag = sanitizeTag(interaction.options.getString('tag'));
    const mode = normalizeMode(interaction.options.getString('modo'));
    const deckSummary = createDeckSummary(tag, mode);

    const embed = new EmbedBuilder()
      .setColor('#31C48D')
      .setTitle(`Deck em ${mode}`)
      .setDescription(`${deckSummary.deck} • ${deckSummary.winRate}`)
      .addFields(
        { name: 'Tag', value: deckSummary.tag, inline: true },
        { name: 'Melhor carta', value: deckSummary.bestCard, inline: true },
        { name: 'Estratégia', value: deckSummary.explanation, inline: false },
      );

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (commandName === 'meta') {
    const mode = normalizeMode(interaction.options.getString('modo'));
    const meta = getMetaForMode(mode);
    const summary = buildMetaSummary(mode);
    const embed = new EmbedBuilder()
      .setColor('#E53E3E')
      .setTitle(meta.title)
      .setDescription(summary)
      .addFields(...meta.decks.map((deck) => ({
        name: `${deck.name} (${deck.winRate})`,
        value: deck.description,
        inline: false,
      })));

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (commandName === 'atualizar') {
    const mode = 'Ladder';
    const summary = buildMetaSummary(mode);
    await interaction.reply(`Meta atualizada com sucesso.\n\n${summary}`);
    return;
  }

  if (commandName === 'plano') {
    const mode = normalizeMode(interaction.options.getString('modo'));
    const enemyDeck = interaction.options.getString('deck_inimigo');
    const playerDeck = interaction.options.getString('deck_jogador') || 'Cycle Control';
    const metaSummary = buildMetaSummary(mode);

    await interaction.deferReply();

    const plan = await generateDeckPlan({
      playerDeck,
      enemyDeck,
      mode,
      metaSummary,
    });

    const embed = new EmbedBuilder()
      .setColor('#9F7AEA')
      .setTitle(`Plano personalizado em ${mode}`)
      .setDescription(`Deck do jogador: ${playerDeck}\nDeck do adversário: ${enemyDeck}`)
      .addFields({ name: 'Estratégia e plano de jogo', value: plan, inline: false });

    await interaction.editReply({ embeds: [embed] });
  }
});

if (!DISCORD_TOKEN) {
  console.warn('DISCORD_TOKEN não configurado. O bot não vai iniciar até que o arquivo .env seja preenchido.');
}

client.login(DISCORD_TOKEN).catch((error) => {
  console.error('Falha ao conectar com o Discord:', error.message);
  process.exit(1);
});
