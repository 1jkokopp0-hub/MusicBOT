const { msToTime } = require("../utils/time");
const { info } = require("../utils/embeds");

const repeatLabels = {
  off: "مغلق",
  track: "اغنية",
  queue: "قائمة"
};

function queueEmbed(player) {
  const current = player.queue.current;
  const upcoming = player.queue.tracks.slice(0, 10);
  const lines = [];

  if (current) {
    lines.push(`**الآن:** **${current.info.title}** — \`${msToTime(current.info.duration)}\``);
  }

  if (!upcoming.length) {
    lines.push("\nلا توجد اغاني قادمة.");
  } else {
    lines.push("\n**القائمة القادمة:**");
    upcoming.forEach((track, index) => {
      lines.push(`${index + 1}. ${track.info.title} — \`${msToTime(track.info.duration)}\``);
    });
  }

  lines.push(`\n**عدد القادم:** ${player.queue.tracks.length}`);
  lines.push(`**الصوت:** ${player.volume}%`);
  lines.push(`**التكرار:** ${repeatLabels[player.repeatMode || "off"] || "مغلق"}`);

  return info("قائمة التشغيل", lines.join("\n"));
}

module.exports = { queueEmbed };
