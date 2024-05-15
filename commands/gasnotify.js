const {readFileSync, writeFileSync} = require("fs");
const {resolve, join} = require("path");
const pricesDataPath = join(process.cwd(), "prices.txt")

module.exports = {
    name: 'gasnotify', description: '**[bot owner only]** thông báo giá xăng', async execute(message, args) {
        if (message.author.id !== process.env.OWNER) {
            message.reply('ai cho dùng command :clueless:');
        } else {
            try {
                let new92Price = parseInt(args[0]) ?? undefined;
                let new95Price = parseInt(args[1]) ?? undefined;

                const currentPrices = readFileSync(pricesDataPath, "utf8");
                const [current92Price, current95Price] = currentPrices.split(",").map((value) => Number(value));

                const diff = {
                    "92": new92Price - current92Price, "95": new95Price - current95Price
                };

                writeFileSync(pricesDataPath, new92Price + "," + new95Price, "utf-8");

                message.channel.send({
                    content: "@everyone **ᴘɪɴ ᴘᴏɴ ᴘᴀɴ ᴘᴏɴ**\n**Update giá xăng trong nước, theo kỳ điều chỉnh được áp dụng từ 15h chiều hôm nay như sau:**",
                    embeds: [{
                        "title": "E5RON92", "color": diff["92"] < 0 ? '#7be863' : '#e85353', "fields": [{
                            "name": "Giá mới", "value": `${new92Price.toLocaleString()} đồng/lít`, "inline": true
                        }, {
                            "name": "Chênh lệch",
                            "value": `${diff["92"] < 0 ? "▼" : "▲"} ${Math.abs(diff["92"]).toLocaleString()} đồng/lít`,
                            "inline": true
                        }]
                    }, {
                        "title": "RON95", "color": diff["95"] < 0 ? '#7be863' : '#e85353', "fields": [{
                            "name": "Giá mới",
                            "value": `${new95Price.toLocaleString()} đồng/lít`,
                            "inline": true
                        }, {
                            "name": "Chênh lệch",
                            "value": `${diff["95"] < 0 ? "▼" : "▲"} ${Math.abs(diff["95"]).toLocaleString()} đồng/lít`,
                            "inline": true
                        }]
                    }]
                });
            } catch (err) {
                console.error(err);
            }
        }
    },
};