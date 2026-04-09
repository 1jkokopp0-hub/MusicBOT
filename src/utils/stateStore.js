const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "..", "..", "data");
const statePath = path.join(dataDir, "botState.json");

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadState() {
  ensureDataDir();

  if (!fs.existsSync(statePath)) {
    const initialState = { stayInVoice: true };
    fs.writeFileSync(statePath, JSON.stringify(initialState, null, 2));
    return initialState;
  }

  try {
    const raw = fs.readFileSync(statePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      stayInVoice: parsed.stayInVoice !== false
    };
  } catch {
    const fallbackState = { stayInVoice: true };
    fs.writeFileSync(statePath, JSON.stringify(fallbackState, null, 2));
    return fallbackState;
  }
}

function saveState(state) {
  ensureDataDir();
  fs.writeFileSync(statePath, JSON.stringify({
    stayInVoice: Boolean(state.stayInVoice)
  }, null, 2));
}

module.exports = { loadState, saveState };
