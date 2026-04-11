const { error, ok } = require("../utils/embeds");
const { parseTimeInput, msToTime } = require("../utils/time");

module.exports = {
  name: "تقديم",
  aliases: ["forward", "ff"],
  async run({ client, message, args }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.current) {
      return message.channel.send({ embeds: [error("ماكو شيء شغال حاليا.")] });
    }

    const amount = parseTimeInput(args[0] || "10");
    if (!amount) {
      return message.channel.send({ embeds: [error("اكتب وقت مثل `10` او `1:30`.")] });
    }

    const nextPosition = Math.min(player.position + amount, player.queue.current.info.duration);
    await player.seek(nextPosition);
    return message.channel.send({
      embeds: [ok(`تم تقديم المقطع الى \`${msToTime(nextPosition)}\`.`)]
    });
  }
};
