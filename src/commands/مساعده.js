const { info } = require("../utils/embeds");

module.exports = {
  name: "مساعده",
  aliases: ["اوامر", "help"],
  voiceOnly: false,
  async run({ message, prefix }) {
    await message.channel.send({
      embeds: [info("اوامر الموسيقى", [
        `\`${prefix}مساعده\``,
        `\`${prefix}تشغيل اسم او رابط\``,
        `\`${prefix}تخطي\``,
        `\`${prefix}ايقاف\``,
        `\`${prefix}قائمة\``,
        `\`${prefix}قائمة 2\``,
        `\`${prefix}الان\``,
        `\`${prefix}باوز\``,
        `\`${prefix}كمل\``,
        `\`${prefix}صوت 80\``,
        `\`${prefix}خلط\``,
        `\`${prefix}حذف 3\``,
        `\`${prefix}مسح\``,
        `\`${prefix}تكرار track\``,
        `\`${prefix}اذهب 1:30\``,
        `\`${prefix}تقديم 15\``,
        `\`${prefix}ترجيع 10\``,
        "`/247 mode:on` او `/247 mode:off`"
      ].join("\n"))]
    });
  }
};
