require("dotenv").config();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

module.exports = {
  token: process.env.BOT_TOKEN,
  prefix: process.env.BOT_PREFIX || "!",
  guildId: process.env.DEFAULT_GUILD_ID,
  autoJoinVoiceChannelId: process.env.AUTO_JOIN_VOICE_CHANNEL_ID,
  voiceTextChannelId: process.env.VOICE_TEXT_CHANNEL_ID,
  ownerIds: (process.env.OWNER_IDS || "").split(",").map((x) => x.trim()).filter(Boolean),
  embedColor: Number(process.env.EMBED_COLOR || "0x5865F2"),
  lavalink: {
    host: process.env.LAVALINK_HOST,
    port: Number(process.env.LAVALINK_PORT || 2333),
    password: process.env.LAVALINK_PASSWORD,
    secure: String(process.env.LAVALINK_SECURE).toLowerCase() === "true"
  },
  defaultVolume: clamp(Number(process.env.DEFAULT_VOLUME || 70), 1, 200),
  maxQueueLength: clamp(Number(process.env.MAX_QUEUE_LENGTH || 200), 10, 1000),
  searchSource: process.env.SEARCH_SOURCE || "ytsearch"
};
