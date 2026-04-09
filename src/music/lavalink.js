const { LavalinkManager } = require("lavalink-client");

function isNodeReady(manager) {
  const node = [...manager.nodeManager.nodes.values()][0];
  return Boolean(node?.isAlive);
}

function createLavalink(client) {
  client.lavalinkReady = false;

  const manager = new LavalinkManager({
    nodes: [
      {
        id: "main",
        host: client.config.lavalink.host,
        port: client.config.lavalink.port,
        authorization: client.config.lavalink.password,
        secure: client.config.lavalink.secure,
        retryAmount: 500,
        retryDelay: 5000
      }
    ],
    sendToShard: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
    autoSkip: true,
    client: {
      id: client.user?.id,
      username: client.user?.username
    },
    playerOptions: {
      defaultSearchPlatform: client.config.searchSource,
      volumeDecrementer: 1
    }
  });

  client.on("raw", (payload) => manager.sendRawData(payload));

  manager.nodeManager.on("connect", (node) => {
    client.lavalinkReady = true;
    console.log(`[LAVALINK] Connected: ${node.id}`);

    if (client.state?.stayInVoice) {
      setTimeout(() => {
        require("./twentyFourSeven").ensureTwentyFourSevenConnection(client).catch((error) => {
          console.error("[BOT] Failed to restore 24/7 after audio backend connected:", error);
        });
      }, 1500);
    }
  });

  manager.nodeManager.on("disconnect", (node, reason) => {
    client.lavalinkReady = false;
    console.log(`[LAVALINK] Disconnected: ${node.id}`, reason || "no reason");
  });

  manager.nodeManager.on("error", (node, error) => {
    console.error(`[LAVALINK] Node error on ${node.id}:`, error);
  });

  return manager;
}

module.exports = { createLavalink, isNodeReady };
