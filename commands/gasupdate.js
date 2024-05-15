const {readFileSync, writeFileSync} = require("fs");
const {resolve, join} = require("path");
const pricesDataPath = join(process.cwd(), "prices.txt")

module.exports = {
    name: 'gasupdate', description: 'cập nhật giá xăng & không thông báo', async execute(message, args) {
        if (message.author.id !== process.env.OWNER) {
            message.reply('ai cho dùng command :clueless:');
        } else {
            try {
                let new92Price = parseInt(args[0]) ?? undefined;
                let new95Price = parseInt(args[1]) ?? undefined;

                const currentPrices = readFileSync(pricesDataPath, "utf8");
                const [current92Price, current95Price] = currentPrices.split(",").map((value) => Number(value));

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