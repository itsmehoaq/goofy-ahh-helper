require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const database = require('./database');
const {aliases} = require("./commands/shortlink");
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const prefix = process.env.PREFIX;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

(async () => {
    try {
        await database.connect();
    } catch (error) {
        const channel = await client.channels.fetch(process.env.LOG_CHANNEL);
        let embed = new MessageEmbed()
            .setColor('#e38989')
            .setTitle('An error occured!')
            .addFields({name: 'error', value: 'Failed to connect to database!'})
            .setFooter({text: 'powered by HoaqGPT\u2122'})
        channel.send({embeds: [embed]});
        // console.log('Failed to connect to database!')
    }
})();

client.once('ready', async () => {
    const channel = await client.channels.fetch(process.env.LOG_CHANNEL);
    let embed = new MessageEmbed()
        .setColor('#8ce389')
        .setTitle('Status update')
        .addFields({name: 'message', value: 'Bot is online!'})
        .setFooter({text: 'powered by HoaqGPT\u2122'})
    channel.send({embeds: [embed]});
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)) {
        let newUrl = message.content.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
        if (['x.com', 'twitter.com', 'fxtwitter.com', 'vxtwitter.com', 'fixupx.com'].some(domain => newUrl[0].startsWith(domain))) {
            const command = client.commands.get('add_twitter_embed');
            command.execute(message, newUrl[0])
        }
        if (['pixiv.net', 'www.pixiv.net'].some(domain => newUrl[0].startsWith(domain))) {
            const command = client.commands.get('add_pixiv_embed');
            command.execute(message, newUrl[0])
        }
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`?`);
    }
});

client.login(process.env.DEV_MODE === '1' ? process.env.DEV_DISCORD_TOKEN : process.env.DISCORD_TOKEN);

