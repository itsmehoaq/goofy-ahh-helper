const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'như tên.',
    execute(message, args) {
        const { commands } = message.client;

        const embed = new MessageEmbed()
            .setColor('#e3e289')
            .setTitle('tao biết làm gì')
            .setDescription('goofy ahh commands:')
            .setTimestamp();

        commands.forEach(command => {
            embed.addField(`**${command.name}**`, `${command.description}`);
        });

        message.channel.send({ embeds: [embed] });
    },
};
