require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const database = require('./database');
const {aliases} = require("./commands/shortlink");
const triggerCommand = require('./commands/budget');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

const prefix = process.env.PREFIX;

client.commands = new Collection();

const loadCommands = () => {
    const commandFoldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(commandFoldersPath).filter(file =>
        fs.statSync(path.join(commandFoldersPath, file)).isDirectory()
    );

    for (const folder of commandFolders) {
        const commandPath = path.join(commandFoldersPath, folder);
        const commandFile = fs.readdirSync(commandPath).find(file => file === 'index.js');

        if (commandFile) {
            const command = require(path.join(commandPath, commandFile));
            client.commands.set(command.name, command);
            console.log(`Loaded folder command: ${command.name}`);
        }
    }

    const commandFiles = fs.readdirSync(commandFoldersPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandFoldersPath, file);
        const command = require(filePath);
        client.commands.set(command.name, command);
        console.log(`Loaded file command: ${command.name}`);
    }
};

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
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error executing this command!',
            ephemeral: true
        });
    }
});

const registerCommands = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        const commands = [];
        client.commands.forEach(command => {
            if (command.options) {
                commands.push({
                    name: command.name,
                    description: command.description,
                    options: command.options
                });
            }
        });

        if (process.env.GUILD_ID) {
            const guild = await client.guilds.fetch(process.env.GUILD_ID);
            if (guild) {
                await guild.commands.set(commands);
                console.log('Successfully registered guild commands.');
            }
        } else {
            await client.application?.commands.set(commands);
            console.log('Successfully registered global commands.');
        }

    } catch (error) {
        console.error('Error registering commands:', error);
    }
};

client.once('ready', async () => {
    loadCommands();

    const channel = await client.channels.fetch(process.env.LOG_CHANNEL);
    let embed = new MessageEmbed()
        .setColor('#8ce389')
        .setTitle('Status update')
        .addFields({name: 'message', value: 'Bot is online!'})
        .setFooter({text: 'powered by HoaqGPT\u2122'})
    channel.send({embeds: [embed]});

    await registerCommands();

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

    if (!message.content.startsWith(prefix)) {  // if message is not a command
        if (!message.content.startsWith(prefix)) {
            const triggerWord = triggerCommand.checkForTriggers(message);
            if (triggerWord) {
                triggerCommand.handleTriggerResponse(message, triggerWord);
            }
            return;
        }
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (commandName === 'trigger') {
        triggerCommand.execute(message, args);
        return;
    }

    if (commandName === 'trigger_add') {
        triggerCommand.execute(message, ['add', ...args]);
        return;
    }

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(process.env.DEV_MODE === '1' ? process.env.DEV_DISCORD_TOKEN : process.env.DISCORD_TOKEN);
