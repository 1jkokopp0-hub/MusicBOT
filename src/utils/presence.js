const { ActivityType } = require("discord.js");

const twitchStreams = [
  "https://www.twitch.tv/riotgames",
  "https://www.twitch.tv/shroud",
  "https://www.twitch.tv/tarik",
  "https://www.twitch.tv/gaules",
  "https://www.twitch.tv/lirik"
];

function pickRandomStream() {
  return twitchStreams[Math.floor(Math.random() * twitchStreams.length)];
}

async function resolveVoiceChannelName(client) {
  const guild = await client.guilds.fetch(client.config.guildId).catch(() => null);
  const channel = guild ? await guild.channels.fetch(client.config.autoJoinVoiceChannelId).catch(() => null) : null;
  return channel?.name || "your voice room";
}

async function updatePresence(client, channelName) {
  if (!client.user) return;

  const resolvedChannelName = channelName || await resolveVoiceChannelName(client);
  client.user.setPresence({
    status: "online",
    activities: [{
      name: `Watching ${resolvedChannelName}`,
      type: ActivityType.Streaming,
      url: pickRandomStream()
    }]
  });
}

module.exports = { updatePresence };
