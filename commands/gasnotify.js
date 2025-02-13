const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'gasnotify',
    description: 'Check cập nhật giá xăng và thông báo (tự động, kinda)',
    async execute(message, args, client) {
        const URL = 'https://vnexpress.net/chu-de/gia-xang-dau-3026';
        const pricesDataPath = join(process.cwd(), "prices.txt");

        if (message.author.id !== process.env.OWNER) {
            return message.reply('ai cho dùng command :clueless:');
        }

        try {
            const response = await axios.get(URL);
            const html = response.data;
            const $ = cheerio.load(html);
            const today = moment().format('D/M/YYYY');
            const searchString = `Giá từ ${today}`;
            const table = $('table');
            const rows = table.find('tr');
            let new92Price = null, diff92 = null;
            let new95Price = null, diff95 = null;
            let isTodayDataAvailable = false;

            rows.each((index, row) => {
                const columns = $(row).find('td');
                if (columns.eq(1).html() && columns.eq(1).html().includes(searchString)) {
                    isTodayDataAvailable = true;
                }
                if (columns.eq(0).text().includes('Xăng E5 RON 92-II')) {
                    new92Price = parseInt(columns.eq(1).text().replace(/\D/g, ''), 10);
                    diff92 = parseInt(columns.eq(2).text().replace(/\D/g, ''), 10) * (columns.eq(2).text().includes('-') ? -1 : 1);
                }
                if (columns.eq(0).text().includes('Xăng RON 95-III')) {
                    new95Price = parseInt(columns.eq(1).text().replace(/\D/g, ''), 10);
                    diff95 = parseInt(columns.eq(2).text().replace(/\D/g, ''), 10) * (columns.eq(2).text().includes('-') ? -1 : 1);
                }
            });

            if (!isTodayDataAvailable) {
                return message.channel.send("Giá xăng chưa thay đổi, vui lòng thử lại sau.");
            }

            if (existsSync(pricesDataPath)) {
                const previousPrices = readFileSync(pricesDataPath, 'utf-8').split(',');
                const previous92Price = parseInt(previousPrices[0], 10);
                const previous95Price = parseInt(previousPrices[1], 10);

                if (new92Price === previous92Price && new95Price === previous95Price) {
                    const errorMessage = await message.channel.send("Đã cập nhật giá, vui lòng thử lại sau.");
                    setTimeout(() => {
                        errorMessage.delete();
                        message.delete();
                    }, 3000);
                    return;
                }
            }

            if (new92Price !== null && new95Price !== null) {
                writeFileSync(pricesDataPath, `${new92Price},${new95Price}`, "utf-8");
            }

            message.channel.send({
                content: "@everyone **ᴘɪɴ ᴘᴏɴ ᴘᴀɴ ᴘᴏɴ**\n**Update giá xăng trong nước, theo kỳ điều chỉnh được áp dụng từ 15h chiều hôm nay như sau:**",
                embeds: [{
                    "title": "E5RON92",
                    "color": diff92 < 0 ? '#7be863' : '#e85353',
                    "fields": [{
                        "name": "Giá mới",
                        "value": `${new92Price.toLocaleString()} đồng/lít`,
                        "inline": true
                    }, {
                        "name": "Chênh lệch",
                        "value": `${diff92 < 0 ? "▼" : "▲"} ${Math.abs(diff92).toLocaleString()} đồng/lít`,
                        "inline": true
                    }]
                }, {
                    "title": "RON95",
                    "color": diff95 < 0 ? '#7be863' : '#e85353',
                    "fields": [{
                        "name": "Giá mới",
                        "value": `${new95Price.toLocaleString()} đồng/lít`,
                        "inline": true
                    }, {
                        "name": "Chênh lệch",
                        "value": `${diff95 < 0 ? "▼" : "▲"} ${Math.abs(diff95).toLocaleString()} đồng/lít`,
                        "inline": true
                    }]
                }]
            });

            if (message.content.startsWith('?gasnotify')) {
                message.delete();
            }
        } catch (error) {
            const ownerChannel = client.guilds.cache.get('723867861600174090').channels.cache.get('1105453792520065144');
            if (ownerChannel) {
                ownerChannel.send('An error occurred while running the gasnotify command.');
            }
        }
    },
    initialize(client) {
        client.on('ready', () => {
            const now = moment();
            const nextThursday = now.clone().day(4).hour(15).minute(0).second(0);
            if (now.day() > 4 || (now.day() === 4 && now.hour() >= 15)) {
                nextThursday.add(1, 'week');
            }
            const delay = nextThursday.diff(now);
            setTimeout(() => {
                setInterval(() => {
                    const channel = client.channels.cache.find(c => c.name === 'commands');
                    if (channel) {
                        channel.send('?gasnotify');
                    }
                }, 7 * 24 * 60 * 60 * 1000);
            }, delay);
        });
    }
};