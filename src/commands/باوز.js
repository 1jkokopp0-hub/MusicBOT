const { error, ok } = require("../utils/embeds");

module.exports = {
  name: "باوز",
  aliases: ["pause"],
  async run({ client, message }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.current) {
      return message.channel.send({ embeds: [error("ماكو شيء يتوقف.")] });
    }

    if (player.paused) {
      return message.channel.send({ embeds: [error("التشغيل متوقف مسبقا.")] });
    }

    await player.pause();
    return message.channel.send({ embeds: [ok("تم ايقاف التشغيل مؤقتا.")] });
  }
};
