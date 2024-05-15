const {writeFileSync} = require("fs");
const {join} = require("path");
const pricesDataPath = join(process.cwd(), "prices.txt")

module.exports = {
    name: 'gasupdate', description: '**[bot owner only]** cập nhật giá xăng & không thông báo', async execute(message, args) {
        if (message.author.id !== process.env.OWNER) {
            message.reply('ai cho dùng command :clueless:');
        } else {
            try {
                let new92Price = parseInt(args[0]) ?? undefined;
                let new95Price = parseInt(args[1]) ?? undefined;

                writeFileSync(pricesDataPath, new92Price + "," + new95Price, "utf-8");

                message.reply('\`prices.txt\` updated!').then(function (message1) {
                    setTimeout(function () {message.delete()}, 5727);
                    setTimeout(function () {message1.delete()}, 2727);
                });
            } catch (err) {
                console.error(err);
            }
        }
    },
};