const { error, ok } = require("../utils/embeds");

const labels = {
  off: "مغلق",
  track: "تكرار اغنية",
  queue: "تكرار القائمة"
};

module.exports = {
  name: "تكرار",
  aliases: ["loop", "repeat"],
  async run({ client, message, args }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.current) {
      return message.channel.send({ embeds: [error("ماكو شيء شغال حاليا.")] });
    }

    const modeInput = (args[0] || "").toLowerCase();
    const modeMap = {
      off: "off",
      stop: "off",
      اغلاق: "off",
      وقف: "off",
      track: "track",
      song: "track",
      اغنيه: "track",
      اغنية: "track",
      queue: "queue",
      list: "queue",
      قائمه: "queue",
      قائمة: "queue"
    };

    const nextMode = modeMap[modeInput];
    if (!nextMode) {
      return message.channel.send({
        embeds: [error("اكتب واحد من هذي: off, track, queue")]
      });
    }

    await player.setRepeatMode(nextMode);
    return message.channel.send({
      embeds: [ok(`تم تغيير وضع التكرار الى: **${labels[nextMode]}**.`)]
    });
  }
};
