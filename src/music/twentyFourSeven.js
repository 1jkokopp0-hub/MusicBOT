const { isNodeReady } = require("./lavalink");

async function getTargetGuildAndChannel(client) {
  const guild = await client.guilds.fetch(client.config.guildId).catch(() => null);
  const channel = guild ? await guild.channels.fetch(client.config.autoJoinVoiceChannelId).catch(() => null) : null;
  return { guild, channel };
}

async function ensureTwentyFourSevenConnection(client) {
  if (!client.state?.stayInVoice) {
    return { ok: false, reason: "disabled" };
  }

  if (!client.lavalink || !isNodeReady(client.lavalink)) {
    return { ok: false, reason: "node_not_ready" };
  }

  const { guild, channel } = await getTargetGuildAndChannel(client);
  if (!guild || !channel || !channel.isVoiceBased()) {
    return { ok: false, reason: "missing_target" };
  }

  const player = await client.lavalink.createPlayer({
    guildId: guild.id,
    voiceChannelId: channel.id,
    textChannelId: client.config.voiceTextChannelId,
    selfDeaf: true,
    volume: client.config.defaultVolume,
    instaUpdateFiltersFix: true,
    applyVolumeAsFilter: false
  });

  if (!player.connected) await player.connect();

  return { ok: true, guild, channel, player };
}

async function disableTwentyFourSevenConnection(client) {
  if (!client.lavalink) return false;

  const player = client.lavalink.getPlayer(client.config.guildId);
  if (!player) return false;

  await player.destroy().catch(() => null);
  return true;
}

module.exports = {
  getTargetGuildAndChannel,
  ensureTwentyFourSevenConnection,
  disableTwentyFourSevenConnection
};
