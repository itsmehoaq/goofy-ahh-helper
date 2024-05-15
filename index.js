require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '?tohex') {
        const inputString = args.join(' ');
        const hexString = stringToHex(inputString);
        message.reply(`Hex: \n\`\`\`\n${hexString}\`\`\``);
    } else if (command === '?totext') {
        const hexString = args.join(' ');
        try {
            const normalString = hexToString(hexString);
            message.reply(`Text: \n\`\`\`\n${normalString}\`\`\``);
        } catch (error) {
            message.reply('Invalid hex string.');
        }
    } else if (command === '?help') {
        message.reply(`Available commands:`)
    }
});

function stringToHex(str) {
    return str.split('')
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}

function hexToString(hex) {
    return hex.match(/.{1,2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('');
}

client.login(process.env.BOT_TOKEN);
