const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const { validateConfig } = require("./deployChecks");
const { loadState } = require("./utils/stateStore");

validateConfig(config);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.config = config;
client.state = loadState();
client.once("clientReady", () => require("./events/ready")(client));
client.on("messageCreate", (message) => require("./events/messageCreate")(client, message));
client.on("interactionCreate", (interaction) => require("./events/interactionCreate")(client, interaction));
client.on("voiceStateUpdate", (oldState, newState) => require("./events/voiceStateUpdate")(client, oldState, newState));
client.login(config.token);
