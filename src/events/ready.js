const { SlashCommandBuilder } = require("discord.js");
const { ensureTwentyFourSevenConnection } = require("../music/twentyFourSeven");
const { isNodeReady, createLavalink } = require("../music/lavalink");
const { updatePresence } = require("../utils/presence");

function waitForNode(manager, timeoutMs = 30_000) {
  if (isNodeReady(manager)) return Promise.resolve(true);

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

  client.lavalink = createLavalink(client);
  await client.lavalink.init({
    id: client.user.id,
    username: client.user.username
  });

  const guild = await client.guilds.fetch(client.config.guildId).catch(() => null);
  const targetChannel = guild ? await guild.channels.fetch(client.config.autoJoinVoiceChannelId).catch(() => null) : null;
  await updatePresence(client, targetChannel?.name);

  if (guild) {
    const commands = [
      new SlashCommandBuilder()
        .setName("247")
        .setDescription("Toggle 24/7 voice mode")
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Turn 24/7 mode on or off")
            .setRequired(true)
            .addChoices(
              { name: "On", value: "on" },
              { name: "Off", value: "off" }
            ))
        .toJSON()
    ];

    await guild.commands.set(commands).then(() => {
      console.log("[SLASH] Registered guild slash commands.");
    }).catch((error) => {
      console.error("[SLASH] Failed to register guild slash commands:", error);
    });
  } else {
    console.warn("[SLASH] Guild was not found. Slash commands were not registered.");
  }

  const nodeReady = await waitForNode(client.lavalink);
  if (!nodeReady) {
    console.warn("[BOT] Audio backend is not ready yet. Skipping startup auto-join.");
    return;
  }

  if (!client.state?.stayInVoice) {
    console.log("[BOT] 24/7 mode is disabled. Skipping startup auto-join.");
    return;
  }

  try {
    const result = await ensureTwentyFourSevenConnection(client);
    if (!result.ok) {
      console.warn("[BOT] Auto-join target was not found or is not a voice channel.");
      return;
    }

    await updatePresence(client, result.channel?.name);
    console.log("[BOT] Auto joined target voice channel.");
  } catch (error) {
    console.error("[BOT] Failed to auto-join on startup:", error);
  }
};
