const { error } = require("../utils/embeds");
const { queueEmbed } = require("../music/queueView");

module.exports = {
  name: "قائمة",
  aliases: ["قائمه", "queue", "q"],
  async run({ client, message, args }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || (!player.queue.current && !player.queue.tracks.length)) {
      return message.channel.send({ embeds: [error("القائمة فاضية.")] });
    }

    const page = Math.max(1, Number(args[0] || 1) || 1);
    return message.channel.send({ embeds: [queueEmbed(player, page)] });
  }
};
