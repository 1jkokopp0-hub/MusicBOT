const { error, ok } = require("../utils/embeds");

module.exports = {
  name: "مسح",
  aliases: ["clear", "cq"],
  async run({ client, message }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.tracks.length) {
      return message.channel.send({ embeds: [error("ماكو شيء بالقائمة ينمسح.")] });
    }

    await player.queue.splice(0, player.queue.tracks.length);
    return message.channel.send({ embeds: [ok("تم مسح الاغاني القادمة من القائمة.")] });
  }
};
