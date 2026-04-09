function msToTime(ms = 0) {
  if (!ms || ms <= 0) return "LIVE";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((value, index) => index === 0 ? String(value) : String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function progressBar(position, duration, size = 12) {
  if (!duration || duration <= 0) return "LIVE";

  const safePosition = Math.max(0, Math.min(position, duration));
  const ratio = safePosition / duration;
  const markerIndex = Math.min(size - 1, Math.floor(ratio * size));

  return Array.from({ length: size }, (_, index) => index === markerIndex ? "●" : "─").join("");
}

module.exports = { msToTime, progressBar };
