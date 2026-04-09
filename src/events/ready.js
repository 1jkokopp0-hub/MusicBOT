function waitForNode(manager, timeoutMs = 30_000) {
  const currentNode = [...manager.nodeManager.nodes.values()][0];
  if (currentNode?.isAlive) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onConnect = () => {
      cleanup();
      resolve(true);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      manager.nodeManager.off("connect", onConnect);
    };

    manager.nodeManager.on("connect", onConnect);
  });
}

module.exports = async (client) => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);

  client.lavalink = require("../music/lavalink").createLavalink(client);
  await client.lavalink.init({
    id: client.user.id,
    username: client.user.username
  });

  const nodeReady = await waitForNode(client.lavalink);
  if (!nodeReady) {
    console.warn("[BOT] Audio backend is not ready yet. Skipping startup auto-join.");
    return;
  }

  const guild = await client.guilds.fetch(client.config.guildId).catch(() => null);
  const channel = guild ? await guild.channels.fetch(client.config.autoJoinVoiceChannelId).catch(() => null) : null;

  if (!guild || !channel || !channel.isVoiceBased()) {
    console.warn("[BOT] Auto-join target was not found or is not a voice channel.");
    return;
  }

  try {
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
    console.log("[BOT] Auto joined target voice channel.");
  } catch (error) {
    console.error("[BOT] Failed to auto-join on startup:", error);
  }
};
