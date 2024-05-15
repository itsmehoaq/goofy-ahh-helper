module.exports = {
    name: 'xinlink',
    description: 'xin link',
    async execute(message, args) {
        // Check if the message is a reply
        if (message.reference) {
            try {
                const originalMessage = await message.channel.messages.fetch(message.reference.messageId);
                await message.delete();
                await originalMessage.reply(`https://hoaq.s-ul.eu/LAM9H98F`);
            } catch (error) {
                console.error('Error fetching the original message:', error);
                message.reply('đã có lỗi xảy ra :tf:');
            }
        } else {
            message.reply('đang xin ai link đấy?');
        }
    },
};