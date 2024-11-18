module.exports = {
    name: 'add_pixiv_embed', description: '**[automated]** sửa preview link pixiv', execute(message, newUrl) {
        try {
            message.suppressEmbeds(true).then(r => {
            });

            if (message.content.includes("||")) {
            } else {
                message.channel.send(`${newUrl.replace('https://pixiv', 'https://phixiv')}`)
            }
        } catch (error) {
            message.channel.send('lỗi rồi pri :D');
        }
    },
};