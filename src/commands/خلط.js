const { error, ok } = require("../utils/embeds");

module.exports = {
  name: "خلط",
  aliases: ["shuffle", "sh"],
  async run({ client, message }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || player.queue.tracks.length < 2) {
      return message.channel.send({ embeds: [error("لازم يكون عندك على الاقل اغنيتين بالقائمة للخلط.")] });
    }

    await player.queue.shuffle();
    return message.channel.send({ embeds: [ok("تم خلط القائمة القادمة.")] });
  }
};
