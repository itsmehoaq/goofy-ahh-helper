module.exports = {
    name: 'add_twitter_embed', description: '**[automated]** sửa preview link twitter / x', execute(message, newUrl) {
        try {
            message.suppressEmbeds(true).then(r => {
            });
            let username = newUrl.split('/')[1]
            message.channel.send(`[Tweet \u25b8 @${username}](https://fixup${newUrl.replace('twitter.', 'x.').replace('fixupx.', 'x.')})`)
        } catch (error) {
            message.channel.send('lỗi rồi pri :D');
        }
    },
};