# MusicBOT

Discord music bot with Arabic text commands, an owner-only `/247` toggle, and a NodeLink backend.

## Railway deployment

Create one Railway project with two services from this same repo.

### Bot service

- Root directory: `/`
- Start command: `npm start`

### NodeLink service

- Root directory: `/nodelink`
- Build command: `npm run build`
- Start command: `npm run start:dist`

### Bot variables

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

### NodeLink variables

- `NODELINK_SERVER_HOST=::`
- `NODELINK_SERVER_PORT=2333`
- `NODELINK_SERVER_PASSWORD`
- `NODELINK_YOUTUBE_TV_REFRESH_TOKEN`

Use the same password for `NODELINK_SERVER_PASSWORD` and `LAVALINK_PASSWORD`.

### Notes

- Both services must stay in the same Railway project.
- `VOICE_TEXT_CHANNEL_ID` must be a text channel ID.
- Put secrets in Railway Variables, not committed files.
