# Clash Meta Bot

Bot Discord em Node.js para analisar o meta atual de Clash Royale, explicar estratégias de deck e gerar um plano de jogo personalizado com IA via AI Gateway.

## Funcionalidades

- `/perfil <tag>`: mostra perfil do jogador, nível e principais decks
- `/deck <tag> <modo>`: exibe o deck principal do jogador no modo solicitado
- `/meta <modo>`: apresenta o meta atualizado do modo
- `/atualizar`: recarrega o estado do meta local
- `/plano <modo> <deck-do-inimigo>`: gera um plano de jogo personalizado com base no deck do usuário, no deck inimigo e no meta atual

## Configuração rápida

1. Instale as dependências:

```bash
npm install
```

2. Copie o exemplo de ambiente:

```bash
cp .env.example .env
```

3. Preencha as variáveis:

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `CLASH_ROYALE_API_KEY` (opcional, se quiser integrar com a API real)
- `AI_GATEWAY_BASE_URL`
- `AI_GATEWAY_API_KEY`
- `AI_GATEWAY_MODEL`

4. Inicie o bot:

```bash
npm start
```

## Estratégia do bot

O bot sempre explica:

- a estratégia principal do deck para vencer;
- como aproveitar a pressão, o trade e a defesa;
- como incomodar o adversário;
- como adaptar a linha de jogo dependendo do deck inimigo e do modo.

## Observações

Se a API real ou o AI Gateway não estiverem configurados, o bot usa um fallback local baseado no meta atual para continuar funcionando.
