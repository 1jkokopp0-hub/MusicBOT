const { error, music } = require("../utils/embeds");
const { isNodeReady, waitForPlayerVoiceState } = require("../music/lavalink");

module.exports = {
  name: "تشغيل",
  aliases: ["شغل", "play", "p"],
  async run({ client, message, args }) {
    const query = args.join(" ").trim();
    if (!query) {
      return message.channel.send({ embeds: [error("اكتب اسم اغنية او رابط.")] });
    }

    const memberVoice = message.member.voice.channelId;
    const botVoice = client.config.autoJoinVoiceChannelId;
    if (!memberVoice || memberVoice !== botVoice) {
      return message.channel.send({ embeds: [error("لازم تكون داخل نفس روم البوت الصوتي.")] });
    }

    if (!client.lavalink || !isNodeReady(client.lavalink)) {
      return message.channel.send({ embeds: [error("خادم الصوت لسه ما جهز. جرب مرة ثانية بعد ثواني.")] });
    }

    const player = await client.lavalink.createPlayer({
      guildId: message.guild.id,
      voiceChannelId: client.config.autoJoinVoiceChannelId,
      textChannelId: client.config.voiceTextChannelId,
      selfDeaf: true,
      volume: client.config.defaultVolume,
      instaUpdateFiltersFix: true,
      applyVolumeAsFilter: false
    });

    if (!player.connected) await player.connect();
    const voiceReady = await waitForPlayerVoiceState(player);
    if (!voiceReady) {
      return message.channel.send({
        embeds: [error("اتصال الروم الصوتي تأخر شوي. جرب الامر مرة ثانية بعد ثواني.")]
      });
    }

    const result = await player.search({ query, source: client.config.searchSource }, message.author);
    if (!result || !result.tracks.length) {
      return message.channel.send({ embeds: [error("ما حصلت نتيجة مناسبة.")] });
    }

    if (result.loadType === "playlist") {
      if (player.queue.tracks.length + result.tracks.length > client.config.maxQueueLength) {
        return message.channel.send({
          embeds: [error(`القائمة وصلت الحد الاقصى (${client.config.maxQueueLength}).`)]
        });
      }

      player.queue.add(result.tracks);
      if (!player.playing) await player.play();
      return message.channel.send({
        embeds: [music("تمت اضافة قائمة", `تمت اضافة **${result.tracks.length}** اغنية.`)]
      });
    }

    if (player.queue.tracks.length + (player.queue.current ? 1 : 0) >= client.config.maxQueueLength) {
      return message.channel.send({
        embeds: [error(`القائمة وصلت الحد الاقصى (${client.config.maxQueueLength}).`)]
      });
    }

    const track = result.tracks[0];
    player.queue.add(track);

    if (!player.playing && !player.paused && !player.queue.current) {
      await player.play();
      return message.channel.send({ embeds: [music("جاري التشغيل", `**${track.info.title}**`)] });
    }

    return message.channel.send({ embeds: [music("تمت الاضافة", `**${track.info.title}**`)] });
  }
};
