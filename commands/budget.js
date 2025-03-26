module.exports = {
    name: 'budget', description: 'nổ cái budget', async execute(message) {
        if (message.reference) {
            try {
                const originalMessage = await message.channel.messages.fetch(message.reference.messageId);
                await message.delete();
                await originalMessage.reply('nổ cái budget ra đây rồi nói chuyện tiếp :thumbsup:');
            } catch (error) {
                console.error('Error fetching the original message:', error);
                message.reply('đã có lỗi xảy ra :tf:');
            }
        } else {
            message.reply('nổ cái budget ra đây rồi nói chuyện tiếp :thumbsup:');
        }
    },
};