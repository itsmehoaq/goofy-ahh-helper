module.exports = {
    name: 'add_twitter_embed', description: 'add preview to twitter / x default links', execute(message,newUrl) {
        try {
                message.suppressEmbeds(true).then(r => {});
                let username = newUrl.split('/')[1]
                message.channel.send(`[Tweet \u25b8 @${username}](https://vx${newUrl.replace('x.','twitter.')})`)
        } catch (error) {
            message.channel.send('lỗi rồi pri :D');
        }
    },
};