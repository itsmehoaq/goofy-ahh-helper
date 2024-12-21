const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'google',
    description: 'Search Google using Google Custom Search JSON API and display the top 3 results as embeds in one message.',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a search query. Usage: `!google <your query>`');
        }
        try {
            await message.reply(`🔍 Searching Google for: \`${query}\``);

            const apiKey = process.env.GG_API_KEY;
            const cx = process.env.CSE_ID;
            const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const embeds = data.items.slice(0, 3).map((result, index) => {
                    return new MessageEmbed()
                        .setColor('#4285F4')
                        .setTitle(result.title)
                        .setURL(result.link)
                        .setDescription(result.snippet || '*không có mô tả cho kết quả tìm kiếm này*')
                        .setFooter({text: `Result ${index + 1}`});
                });
                await message.channel.send({embeds});
            } else {
                const noResultsEmbed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Đã xảy ra lỗi!')
                    .setDescription(`Không có kết quả tìm kiếm cho từ khoá \`${query}\`. [Nhấn vào đây](https://www.google.com/search?q=${encodeURIComponent(query)}) để thử lại.`);
                await message.channel.send({embeds: [noResultsEmbed]});
            }
        } catch (error) {
            console.error('Đã xảy ra lỗi:', error);
            const errorEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Đã xảy ra lỗi!')
                .setDescription('Vui lòng thử lại sau.');
            await message.channel.send({embeds: [errorEmbed]});
        }
    },
};