const { error, ok } = require("../utils/embeds");

module.exports = {
  name: "حذف",
  aliases: ["remove", "rm"],
  async run({ client, message, args }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.tracks.length) {
      return message.channel.send({ embeds: [error("القائمة فاضية.")] });
    }

    const index = Number(args[0]);
    if (!Number.isInteger(index) || index < 1 || index > player.queue.tracks.length) {
      return message.channel.send({
        embeds: [error(`اكتب رقم صحيح من 1 الى ${player.queue.tracks.length}.`)]
      });
    }

    const removedTrack = player.queue.tracks[index - 1];
    await player.queue.remove(index - 1);

    return message.channel.send({
      embeds: [ok(`تم حذف **${removedTrack.info.title}** من القائمة.`)]
    });
  }
};
