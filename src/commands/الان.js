const { error, info } = require("../utils/embeds");
const { msToTime, progressBar } = require("../utils/time");

const repeatLabels = {
  off: "مغلق",
  track: "اغنية",
  queue: "قائمة"
};

module.exports = {
  name: "الان",
  aliases: ["now", "np"],
  async run({ client, message }) {
    const player = client.lavalink.getPlayer(message.guild.id);
    if (!player || !player.queue.current) {
      return message.channel.send({ embeds: [error("ماكو شيء شغال.")] });
    }

    const track = player.queue.current;
    const duration = track.info.duration || 0;
    const position = duration > 0 ? Math.min(player.position, duration) : 0;

    return message.channel.send({
      embeds: [info("يعمل الآن", [
        `**${track.info.title}**`,
        track.info.author ? `بواسطة: **${track.info.author}**` : null,
        duration > 0 ? `${progressBar(position, duration)} \`${msToTime(position)} / ${msToTime(duration)}\`` : "`LIVE`",
        `الصوت: **${player.volume}%**`,
        `التكرار: **${repeatLabels[player.repeatMode || "off"] || "مغلق"}**`
      ].filter(Boolean).join("\n"))]
    });
  }
};
