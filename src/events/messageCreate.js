const fs = require("node:fs");
const path = require("node:path");
const { error } = require("../utils/embeds");
const { normalizeArabicInput } = require("../utils/arabic");

const commands = new Map();
const commandsPath = path.join(__dirname, "..", "commands");
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))) {
  const command = require(path.join(commandsPath, file));
  commands.set(normalizeArabicInput(command.name.toLowerCase()), command);
  for (const alias of command.aliases || []) {
    commands.set(normalizeArabicInput(alias.toLowerCase()), command);
  }
}

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;
  if (message.channel.id !== client.config.voiceTextChannelId) return;

  const raw = message.content.slice(client.config.prefix.length).trim();
  if (!raw.length) return;

  const parts = raw.split(/\s+/);
  const commandName = normalizeArabicInput((parts.shift() || "").toLowerCase());
  const args = parts;
  const command = commands.get(commandName);
  if (!command) return;

  if (command.voiceOnly !== false && message.member.voice.channelId !== client.config.autoJoinVoiceChannelId) {
    return message.channel.send({
      embeds: [error("لازم تكون داخل نفس الروم الصوتي الخاص بالموسيقى.")]
    });
  }

  try {
    await command.run({ client, message, args, prefix: client.config.prefix });
  } catch (err) {
    console.error(err);
    await message.channel.send({
      embeds: [error("صار خطأ داخلي اثناء تنفيذ الامر.")]
    }).catch(() => null);
  }
};
