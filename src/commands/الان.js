const { EmbedBuilder } = require("discord.js");
const config = require("../config");
const { error } = require("../utils/embeds");
const { msToTime, progressBar } = require("../utils/time");

const repeatLabels = {
  off: "مغلق",
  track: "اغنية",
  queue: "قائمة"
};

function getRequesterName(track) {
  return track?.requester?.globalName || track?.requester?.username || track?.userData?.requester?.globalName || track?.userData?.requester?.username || null;
}

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
    const requester = getRequesterName(track);

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle("يعمل الآن")
      .setDescription([
        `**${track.info.title}**`,
        track.info.author ? `بواسطة: **${track.info.author}**` : null,
        duration > 0 ? `${progressBar(position, duration)} \`${msToTime(position)} / ${msToTime(duration)}\`` : "`LIVE`",
        `الصوت: **${player.volume}%**`,
        `التكرار: **${repeatLabels[player.repeatMode || "off"] || "مغلق"}**`,
        requester ? `الطالب: **${requester}**` : null
      ].filter(Boolean).join("\n"))
      .setTimestamp();

    if (track.info.uri) embed.setURL(track.info.uri);
    if (track.info.artworkUrl) embed.setThumbnail(track.info.artworkUrl);

    return message.channel.send({ embeds: [embed] });
  }
};
