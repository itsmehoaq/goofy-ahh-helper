const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TRIGGERS_FILE = path.join(__dirname, '../data/trigger.txt');
const OWNER_ID = process.env.OWNER_ID;

module.exports = {
    name: 'budget',
    description: 'Manages trigger words and responses',

    loadTriggers() {
        try {
            const content = fs.readFileSync(TRIGGERS_FILE, 'utf8');
            return JSON.parse(content.trim());
        } catch (error) {
            console.error('Error loading triggers:', error);
            return ["rec", "recommend", "kiem giup", "rcm", "tim giup", "tim ho", "suggest"];
        }
    },

    saveTriggers(triggers) {
        try {
            const dir = path.dirname(TRIGGERS_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(TRIGGERS_FILE, JSON.stringify(triggers, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving triggers:', error);
            return false;
        }
    },

    checkForTriggers(message) {
        const messageContent = message.content.toLowerCase();
        const triggers = this.loadTriggers();

        const words = messageContent.split(/[\s,.!?;:()[\]{}'"\/\\<>]+/);

        for (const trigger of triggers) {
            if (trigger.includes(' ')) {
                if (messageContent.includes(trigger.toLowerCase())) {
                    return trigger;
                }
            }
            else if (words.includes(trigger.toLowerCase())) {
                return trigger;
            }
        }
        return false;
    },

    handleTriggerResponse(message, triggerWord) {
        message.reply('nếu đang cần recommend thì nổ cái budget ra trước rồi tính tiếp :thumbsup:');
    },

    execute(message, args) {
        if (args[0] === 'add') {
            if (message.author.id !== OWNER_ID) {
                return message.reply('Only the bot owner can add trigger words!');
            }

            const newTrigger = args.slice(1).join(' ').toLowerCase();
            if (!newTrigger) {
                return message.reply('Please provide a trigger word to add!');
            }

            const triggers = this.loadTriggers();
            if (triggers.includes(newTrigger)) {
                return message.reply('This trigger word already exists!');
            }

            triggers.push(newTrigger);
            if (this.saveTriggers(triggers)) {
                return message.reply(`Successfully added "${newTrigger}" to trigger words!`);
            } else {
                return message.reply('Failed to save the new trigger word.');
            }
        }

        else if (args[0] === 'remove') {
            if (message.author.id !== OWNER_ID) {
                return message.reply('Only the bot owner can remove trigger words!');
            }

            const triggerToRemove = args.slice(1).join(' ').toLowerCase();
            if (!triggerToRemove) {
                return message.reply('Please provide a trigger word to remove!');
            }

            const triggers = this.loadTriggers();
            const index = triggers.indexOf(triggerToRemove);

            if (index === -1) {
                return message.reply('This trigger word does not exist in the list!');
            }

            triggers.splice(index, 1);
            if (this.saveTriggers(triggers)) {
                return message.reply(`Successfully removed "${triggerToRemove}" from trigger words!`);
            } else {
                return message.reply('Failed to remove the trigger word.');
            }
        }

        else if (args[0] === 'list') {
            const triggers = this.loadTriggers();
            return message.reply(`Current trigger words: ${triggers.join(', ')}`);
        }

        else {
            return message.reply('Available subcommands: `list` (for everyone), `add` and `remove` (owner only)');
        }
    }
};
