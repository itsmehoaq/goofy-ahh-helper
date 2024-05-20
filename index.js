require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {Client, Intents, Collection} = require('discord.js');
const database = require('./database');
const {aliases} = require("./commands/shortlink");
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const prefix = (process.env.DEV_MODE === 1) ? "??" : process.env.PREFIX;

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
        console.log('Failed to connect to database!')
    }
})();

client.once('ready', () => {
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
        message.reply('command này mai có :D');
    }
});

if (process.env.DEV_MODE === '1') {
    client.login(process.env.DEV_DISCORD_TOKEN);
} else {
    client.login(process.env.DISCORD_TOKEN);
}

