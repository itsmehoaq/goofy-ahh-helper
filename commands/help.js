const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all available commands',
    execute(message, args) {
        const { commands } = message.client;

        const embed = new MessageEmbed()
            .setColor('#e3e289')
            .setTitle('tao biết làm gì')
            .setDescription('dùng lệnh nào khác ngoài những lệnh sau thì coi chừng tao:')
            .setTimestamp();

        commands.forEach(command => {
            embed.addField(`**${command.name}**`, `${command.description}`);
        });

        message.channel.send({ embeds: [embed] });
    },
};
