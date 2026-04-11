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

function parseTimeInput(input) {
  if (!input) return null;
  const value = String(input).trim();

  if (/^\d+$/.test(value)) {
    return Number(value) * 1000;
  }

  if (/^\d+:\d{1,2}(:\d{1,2})?$/.test(value)) {
    const parts = value.split(":").map((part) => Number(part));
    if (parts.some((part) => Number.isNaN(part))) return null;

    let seconds = 0;
    for (const part of parts) {
      seconds = seconds * 60 + part;
    }
    return seconds * 1000;
  }

  return null;
}

module.exports = { msToTime, progressBar, parseTimeInput };
