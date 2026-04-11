const { error, ok } = require("../utils/embeds");
const { parseTimeInput, msToTime } = require("../utils/time");

module.exports = {
  name: "اذهب",
  aliases: ["seek", "goto"],
  async run({ client, message, args }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.current) {
      return message.channel.send({ embeds: [error("ماكو شيء شغال حاليا.")] });
    }

    const target = parseTimeInput(args[0]);
    if (target === null) {
      return message.channel.send({ embeds: [error("اكتب وقت مثل `90` او `1:30` او `01:15:00`.")] });
    }

    const bounded = Math.max(0, Math.min(target, player.queue.current.info.duration));
    await player.seek(bounded);
    return message.channel.send({
      embeds: [ok(`تم الانتقال الى \`${msToTime(bounded)}\`.`)]
    });
  }
};
