const {MessageEmbed} = require("discord.js");
const crypto = require('crypto');
const {Shortlink} = require('../database/models/shortlink.js');
const {Counter} = require('../database/models/counter.js');
const database = require('../database');

module.exports = {
    name: 'shortlink', aliases:['shortlink','sl'], description: 'tạo link rút gọn', execute(message, args) {
        switch (args[0]) {
            case 'create':
                createShortlink(message, args);
                break;
            case 'list':
                listShortlink(message, args);
                break;
            default:
                message.reply(`xem cách dùng lệnh bằng \`?help sl\``);
        }
    },
};

async function createShortlink(message, args) {
    const key = generateRandomAlphaNumericString(7);
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CLOUDFLARE_NAMESPACE_ID}/bulk`, {
        method: 'PUT', headers: {
            'Authorization': 'Bearer ' + process.env.CLOUDFLARE_TOKEN, 'Content-Type': 'application/json'
        }, body: JSON.stringify([{
            'key': key, 'value': args[1]
        }])
    })
    let embed;
    if (response.ok) {
        try {
            let counter = await Counter.findOneAndUpdate({coll: "shortlinks"}, {$inc: {seq: 1}}, {new: true});

            if (!counter) {
                counter = await Counter.create({
                    coll: "shortlinks", seq: 1,
                });
            }
            await Shortlink.create({
                idx: counter.seq, discord_id: message.author.id, key: key, url: args[1]
            });

            embed = new MessageEmbed()
                .setColor('#7ae696')
                .setTitle(`đã tạo link rút gọn #${counter.seq}`)
                .addFields({name: 'URL', value: `https://s.hoaq.net/${key}`}, {name: 'destination', value: args[1]})
                .setFooter({text: 'powered by MunGPT\u2122'});
            await message.author.send({embeds: [embed]})

        } catch (error) {
            embed = new MessageEmbed()
                .setColor('#e67a7a')
                .setTitle('đã có lỗi xảy ra khi tạo link rút gọn')
                .addFields({name: 'error', value: error.message})
                .setFooter({text: 'powered by MunGPT \u2122'});
            await message.author.send({embeds: [embed]})
        }
    } else {
        embed = new MessageEmbed()
            .setColor('#e67a7a')
            .setTitle('đã có lỗi xảy ra khi tạo link rút gọn')
            .addFields({name: 'error code', value: response.status}, {name: 'message', value: response.statusText})
            .setFooter({text: 'powered by MunGPT \u2122'});
        await message.author.send({embeds: [embed]})
    }
}

async function listShortlink(message, args) {
    if (!args[2]) {
        const shortlinks = await Shortlink.find({
            discord_id: message.author.id
        });
        let response = ''
        shortlinks.forEach(link => {
            response += `\n**Key:** \`${link.key}\` | [Destination URL](<${link.url}>)`
        })
        if (response.Length >= 2000) {
            embed = new MessageEmbed()
                .setColor('#dd89e3')
                .setTitle('danh sách link rút gọn đã tạo')
                .setDescription(`list quá dài, không gửi được.\ndùng lệnh \`\`?sl list <page_count>\`\` để xem danh sách`)
                .setFooter({text: 'powered by MunGPT\u2122'});
        }
        embed = new MessageEmbed()
            .setColor('#dd89e3')
            .setTitle('danh sách link rút gọn đã tạo')
            .setDescription(response)
            .setFooter({text: 'page 1/1 ・ powered by MunGPT\u2122'});
    } else {
        embed = new MessageEmbed()
            .setColor('#dd89e3')
            .setTitle('danh sách link rút gọn đã tạo')
            .setDescription(`page feature coming soon!`)
            .setFooter({text: 'powered by MunGPT\u2122'});
    }
    message.author.send({embeds: [embed]});
}

function generateRandomAlphaNumericString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    while (result.length < length) {
        const randomBytes = crypto.randomBytes(length);

        for (let i = 0; i < randomBytes.length && result.length < length; i++) {
            const randomValue = randomBytes[i];
            result += characters.charAt(randomValue % charactersLength);
        }
    }
    return result;
}