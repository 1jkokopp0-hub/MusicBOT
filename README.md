# MusicBOT

Arabic-first Discord music bot powered by `discord.js` with a separate `NodeLink` backend.

## What The Bot Can Do

- Play songs from text search or direct links
- Accept Arabic and English command aliases
- Join and stay in one configured music voice channel
- Restrict commands to one configured text channel
- Show a purple streaming-style status with:
  `Watching <voice-channel-name>`
- Use owner-only `/247` to keep the bot in voice
- Recover its 24/7 voice session after backend reconnects
- Manage queue playback with stop, skip, pause, resume, clear, shuffle, remove, volume, and repeat
- Show current track progress, queue information, repeat mode, and volume

## Commands

### Text Commands

- `!مساعده`
- `!تشغيل <name-or-link>`
- `!play <name-or-link>`
- `!تخطي`
- `!ايقاف`
- `!باوز`
- `!كمل`
- `!الان`
- `!قائمة`
- `!صوت <1-200>`
- `!خلط`
- `!حذف <queue-number>`
- `!مسح`
- `!تكرار off`
- `!تكرار track`
- `!تكرار queue`

### Slash Commands

- `/247 mode:on`
- `/247 mode:off`

`/247` only works for users listed in `OWNER_IDS`.

## Bot Rules

- The bot reads text commands only in `VOICE_TEXT_CHANNEL_ID`
- Most commands require the user to be inside `AUTO_JOIN_VOICE_CHANNEL_ID`
- `!ايقاف` clears playback
  If 24/7 is on, the bot stays connected
  If 24/7 is off, the bot disconnects
- Queue size is limited by `MAX_QUEUE_LENGTH`

## Project Structure

- [src/index.js](C:\Users\11ene\Desktop\Bots\MusicBOT\src\index.js)
  Bootstraps the Discord client and event wiring
- [src/events](C:\Users\11ene\Desktop\Bots\MusicBOT\src\events)
  Handles ready, text commands, slash commands, and voice updates
- [src/commands](C:\Users\11ene\Desktop\Bots\MusicBOT\src\commands)
  Music and queue commands
- [src/music](C:\Users\11ene\Desktop\Bots\MusicBOT\src\music)
  Audio backend helpers, queue rendering, and 24/7 connection logic
- [src/utils](C:\Users\11ene\Desktop\Bots\MusicBOT\src\utils)
  Shared helpers for embeds, Arabic normalization, state, timing, and presence
- [nodelink](C:\Users\11ene\Desktop\Bots\MusicBOT\nodelink)
  Separate backend service for audio playback

## Local Setup

### Install dependencies

Root bot:

```powershell
npm install
```

NodeLink:

```powershell
cd nodelink
npm install
```

### Configure environment

Use [`.env.example`](C:\Users\11ene\Desktop\Bots\MusicBOT\.env.example) as your template.

Required bot values:

- `BOT_TOKEN`
- `BOT_PREFIX`
- `DEFAULT_GUILD_ID`
- `AUTO_JOIN_VOICE_CHANNEL_ID`
- `VOICE_TEXT_CHANNEL_ID`
- `OWNER_IDS`
- `LAVALINK_HOST`
- `LAVALINK_PORT`
- `LAVALINK_PASSWORD`
- `LAVALINK_SECURE`
- `DEFAULT_VOLUME`
- `MAX_QUEUE_LENGTH`
- `SEARCH_SOURCE`

### Start locally

Start NodeLink:

```powershell
npm run start:nodelink
```

Start the bot:

```powershell
node src/index.js
```

## Railway Deployment

Create one Railway project with two services from the same repo.

### Service 1: Bot

- Root Directory: `/`
- Start Command: `npm start`

### Service 2: NodeLink

- Root Directory: `/nodelink`
- Build Command: `npm install --include=dev`
- Start Command: `npm run start:dist`

`start:dist` is intentionally configured to run safely in Railway.

## Railway Variables

### Bot Service

- `BOT_TOKEN`
- `BOT_PREFIX`
- `DEFAULT_GUILD_ID`
- `AUTO_JOIN_VOICE_CHANNEL_ID`
- `VOICE_TEXT_CHANNEL_ID`
- `OWNER_IDS`
- `EMBED_COLOR`
- `LAVALINK_HOST`
- `LAVALINK_PORT`
- `LAVALINK_PASSWORD`
- `LAVALINK_SECURE`
- `DEFAULT_VOLUME`
- `MAX_QUEUE_LENGTH`
- `SEARCH_SOURCE`

Recommended values:

- `LAVALINK_HOST=nodelink.railway.internal`
- `LAVALINK_PORT=2333`
- `LAVALINK_SECURE=false`
- `SEARCH_SOURCE=ytsearch`

### NodeLink Service

- `NODELINK_SERVER_HOST=0.0.0.0`
- `NODELINK_SERVER_PORT=2333`
- `NODELINK_SERVER_PASSWORD`
- `NODELINK_YOUTUBE_TV_REFRESH_TOKEN`

Use the same password for:

- `NODELINK_SERVER_PASSWORD`
- `LAVALINK_PASSWORD`

## Notes And Limits

- `VOICE_TEXT_CHANNEL_ID` must be a text channel ID
- Both Railway services must stay in the same Railway project
- Secrets should go in Railway variables, not committed files
- `/247` state is stored in `data/botState.json`
  On Railway, local file storage may not survive every rebuild or redeploy
- If you want permanent 24/7 persistence, the next upgrade should move that state into a real persistent store

## What Was Added And Improved

- Swapped the audio backend from Lavalink to NodeLink
- Fixed Railway startup issues for both services
- Restored and fixed the owner-only `/247` slash command
- Added queue limit handling
- Added `shuffle`, `remove`, `clear`, and `repeat` commands
- Improved `now playing` with progress display
- Improved queue output with repeat mode and queue count
- Improved `stop` behavior when 24/7 is enabled
- Added purple streaming-style VC-name presence
- Added better recovery when the backend reconnects
