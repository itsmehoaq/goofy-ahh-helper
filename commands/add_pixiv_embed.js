module.exports = {
    name: 'add_pixiv_embed', description: '**[automated]** sửa preview link pixiv', execute(message, newUrl) {
        try {
            message.suppressEmbeds(true).then(r => {
            });

            if (message.content.includes("||")) {
            } else {
                message.channel.send(`https://${newUrl.replace('www.pixiv', 'phixiv')}`)
            }
        } catch (error) {
            message.channel.send('lỗi rồi pri :D');
        }
    },
};