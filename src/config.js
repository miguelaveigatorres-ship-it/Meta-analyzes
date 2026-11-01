const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  CLASH_ROYALE_API_KEY: process.env.CLASH_ROYALE_API_KEY || '',
  CLASH_ROYALE_PROXY: process.env.CLASH_ROYALE_PROXY || 'https://proxy.royaleapi.com',
  AI_GATEWAY_BASE_URL: process.env.AI_GATEWAY_BASE_URL || 'https://ai-gateway.example.com/v1',
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY || '',
  AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL || 'gpt-4o-mini',
  META_REFRESH_INTERVAL_MS: Number(process.env.META_REFRESH_INTERVAL_MS || 10800000),
};
