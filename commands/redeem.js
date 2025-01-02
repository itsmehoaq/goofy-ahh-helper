const PLATFORM_CONFIG = [
    {
        platform: 'hsr',
        name: 'Honkai: Star Rail',
        redeemUrl: (code) => `https://hsr.hoyoverse.com/gift?code=${code}`,
        baseUrl: 'https://hsr.hoyoverse.com/gift'
    },
    {
        platform: 'genshin',
        name: 'Genshin Impact',
        redeemUrl: (code) => `https://genshin.hoyoverse.com/en/gift?code=${code}`,
        baseUrl: 'https://genshin.hoyoverse.com/en/gift'
    },
    {
        platform: 'zzz',
        name: 'Zenless Zone Zero',
        redeemUrl: (code) => `https://zenless.hoyoverse.com/redemption?code=${code}`,
        baseUrl: 'https://zenless.hoyoverse.com/redemption'
    },
    {
        platform: 'cnuy',
        name: 'Blue Archive',
        redeemUrl: (code) => `https://mcoupon.nexon.com/bluearchive`,
        baseUrl: 'https://mcoupon.nexon.com/bluearchive'
    },
    {
        platform: 'gfl2',
        name: 'Girls\' Frontline 2',
        redeemUrl: (code) => `https://gf2exilium.sunborngame.com/main/code`,
        baseUrl: 'https://gf2exilium.sunborngame.com/main/code'
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
            description: 'Set game sử dụng code',
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
            description: 'Điền code vào URL để nhận nhanh',
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

        const redeemLink = prefill ? platformConfig.redeemUrl(code) : platformConfig.baseUrl;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${platform} Redeem Code`)
            .setDescription(`Redeem code for ${platform}`)
            .addFields(
                {name: 'Code', value: `\`${code}\``, inline: true},
                {name: 'Game', value: platform, inline: true},
                {
                    name: 'URL Type',
                    value: prefill ? '🔗 Code pre-filled in URL' : '🔗 Manual redeem page',
                    inline: true
                },
                {
                    name: 'Redeem Link',
                    value: `${redeemLink}`
                }
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
            time: 60000
        });

        collector.on('collect', async i => {
            await i.reply({
                content: `${code}`,
                ephemeral: true
            });
        });

        collector.on('end', collected => {
            const updatedRow = new MessageActionRow()
                .addComponents(
                    row.components[0].setDisabled(true),
                    row.components[1]
                );
            interaction.editReply({components: [updatedRow]}).catch(console.error);
        });
    },
};