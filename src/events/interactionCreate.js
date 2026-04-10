const { MessageFlags } = require("discord.js");
const { disableTwentyFourSevenConnection, ensureTwentyFourSevenConnection } = require("../music/twentyFourSeven");
const { updatePresence } = require("../utils/presence");
const { saveState } = require("../utils/stateStore");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "247") return;

  if (!client.config.ownerIds.includes(interaction.user.id)) {
    return interaction.reply({
      content: "هذا الامر للمالك فقط.",
      flags: MessageFlags.Ephemeral
    });
  }

  const mode = interaction.options.getString("mode", true);
  const enable = mode === "on";

  client.state.stayInVoice = enable;
  saveState(client.state);

  if (!enable) {
    await disableTwentyFourSevenConnection(client);
    await updatePresence(client);
    return interaction.reply({
      content: "تم تعطيل وضع 24/7 وخروج البوت من الروم الصوتي.",
      flags: MessageFlags.Ephemeral
    });
  }

  const result = await ensureTwentyFourSevenConnection(client);
  if (!result.ok) {
    await updatePresence(client);

    const content = result.reason === "node_not_ready"
      ? "تم تفعيل 24/7، لكن خادم الصوت لم يجهز بعد. جرب بعد ثواني."
      : "تم تفعيل 24/7، لكن ما قدرت اوصل للروم الصوتي المحدد.";

    return interaction.reply({
      content,
      flags: MessageFlags.Ephemeral
    });
  }

  await updatePresence(client, result.channel?.name);
  return interaction.reply({
    content: "تم تفعيل وضع 24/7 والبوت الآن داخل الروم الصوتي.",
    flags: MessageFlags.Ephemeral
  });
};
