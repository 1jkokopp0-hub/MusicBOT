const { ensureTwentyFourSevenConnection } = require("../music/twentyFourSeven");
const { updatePresence } = require("../utils/presence");

module.exports = async (client, oldState, newState) => {
  if (!client.state?.stayInVoice) return;
  if (!client.user || oldState.id !== client.user.id) return;

  const leftTargetChannel = oldState.channelId === client.config.autoJoinVoiceChannelId
    && newState.channelId !== client.config.autoJoinVoiceChannelId;

  if (!leftTargetChannel) return;

  setTimeout(() => {
    ensureTwentyFourSevenConnection(client).catch((error) => {
      console.error("[BOT] Failed to restore 24/7 voice connection:", error);
    });
  }, 3000);

  setTimeout(() => {
    updatePresence(client).catch(() => null);
  }, 3500);
};
