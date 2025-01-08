const PLATFORM_CONFIG = [
    {
        platform: 'hsr',
        name: 'Honkai: Star Rail',
        redeemUrl: (code) => `https://hsr.hoyoverse.com/gift?code=${code}`,
        baseUrl: 'https://hsr.hoyoverse.com/gift',
        icon: 'https://s.hoaq.works/Sticker_PPG_15_Pom-Pom_01.webp'
    },
    {
        platform: 'genshin',
        name: 'Genshin Impact',
        redeemUrl: (code) => `https://genshin.hoyoverse.com/en/gift?code=${code}`,
        baseUrl: 'https://genshin.hoyoverse.com/en/gift',
        icon: 'https://s.hoaq.works/Icon_Emoji_CFFA_Gifts.webp'
    },
    {
        platform: 'zzz',
        name: 'Zenless Zone Zero',
        redeemUrl: (code) => `https://zenless.hoyoverse.com/redemption?code=${code}`,
        baseUrl: 'https://zenless.hoyoverse.com/redemption',
        icon: 'https://s.hoaq.works/NPC_Eous.webp'
    },
    {
        platform: 'cnuy',
        name: 'Blue Archive',
        redeemUrl: (code) => `https://mcoupon.nexon.com/bluearchive`,
        baseUrl: 'https://mcoupon.nexon.com/bluearchive',
        icon: 'https://s.hoaq.works/Arona_Icon.webp'
    },
    {
        platform: 'gfl2',
        name: 'Girls\' Frontline 2',
        redeemUrl: (code) => `https://gf2exilium.sunborngame.com/main/code`,
        baseUrl: 'https://gf2exilium.sunborngame.com/main/code',
        icon: 'https://s.hoaq.works/1241450972459307048.webp'
    }
];
const PLATFORM_CHOICES = Object.values(PLATFORM_CONFIG).map(platform => ({
    name: platform.name,
    value: platform.name
}));
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
module.exports = {
    name: 'redeem',
    description: 'Generate a redeem code embed for different gaming platforms',
    options: [
        {
            name: 'platform',
            description: 'Chọn game sử dụng code',
            type: 'STRING',
            required: true,
            choices: PLATFORM_CHOICES
        },
        {
            name: 'code',
            description: 'Redeem code',
            type: 'STRING',
            required: true
        },
        {
            name: 'prefill',
            description: 'Tạo URL điền sẵn redeem code',
            type: 'BOOLEAN',
            required: false
        }
    ],
    async execute(interaction) {
        const platform = interaction.options.getString('platform');
        const code = interaction.options.getString('code');
        const prefill = interaction.options.getBoolean('prefill') ?? false;
        const platformConfig = PLATFORM_CONFIG.find(game =>
            game.name.toLowerCase() === platform.toLowerCase()
        );
        const gameIcon = platformConfig.icon;
        const redeemLink = prefill ? platformConfig.redeemUrl(code) : platformConfig.baseUrl;
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail(`${gameIcon}`)
            .setTitle(`${platform}`)
            .setDescription(`New redeem code found`)
            .addFields(
                {name: 'Code', value: `\`${code}\``, inline: true},
                {name: 'Redeem URL', value: `${redeemLink}`}
            )
            .setTimestamp()
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('copy_code')
                    .setLabel('Show Redeem Code')
                    .setStyle('PRIMARY')
                    .setEmoji('📋'),
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel(prefill ? 'Open Pre-filled Page' : 'Open Redeem Page')
                    .setURL(redeemLink)
            );
        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: false
        });
        const filter = i => i.customId === 'copy_code';
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 864000000
        });
        collector.on('collect', async i => {
            await i.reply({
                content: `${code}`,
                ephemeral: true
            });
        });
        collector.on('end', collected => {
            interaction.editReply({components: []}).catch(console.error);
        });
    },
};