const { EmbedBuilder } = require("discord.js");
const config = require("../config");
const { msToTime } = require("../utils/time");

const repeatLabels = {
  off: "مغلق",
  track: "اغنية",
  queue: "قائمة"
};

function queueEmbed(player, page = 1, pageSize = 10) {
  const current = player.queue.current;
  const totalTracks = player.queue.tracks.length;
  const totalPages = Math.max(1, Math.ceil(totalTracks / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const upcoming = player.queue.tracks.slice(start, start + pageSize);

  const lines = [];
  if (current) {
    lines.push(`**الآن:** **${current.info.title}** — \`${msToTime(current.info.duration)}\``);
  }

  if (!upcoming.length) {
    lines.push("\nلا توجد اغاني قادمة.");
  } else {
    lines.push("\n**القائمة القادمة:**");
    upcoming.forEach((track, index) => {
      lines.push(`${start + index + 1}. ${track.info.title} — \`${msToTime(track.info.duration)}\``);
    });
  }

  lines.push(`\n**عدد القادم:** ${totalTracks}`);
  lines.push(`**الصوت:** ${player.volume}%`);
  lines.push(`**التكرار:** ${repeatLabels[player.repeatMode || "off"] || "مغلق"}`);

  const embed = new EmbedBuilder()
    .setColor(config.embedColor)
    .setTitle("قائمة التشغيل")
    .setDescription(lines.join("\n"))
    .setFooter({ text: `الصفحة ${currentPage}/${totalPages}` })
    .setTimestamp();

  if (current?.info?.artworkUrl) {
    embed.setThumbnail(current.info.artworkUrl);
  }

  return embed;
}

module.exports = { queueEmbed };
