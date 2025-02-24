const fs = require('fs');
const path = require('path');

const TRIGGERS_FILE = path.join(__dirname, '../data/budget_triggers.txt');

module.exports = {
    name: 'budget',
    description: 'heh',

    loadTriggers() {
        try {
            const content = fs.readFileSync(TRIGGERS_FILE, 'utf8');
            return JSON.parse(content.trim());
        } catch (error) {
            console.error('Error loading triggers words', error);
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

    execute(message, args) {
        if (args[0] === 'add_trigger') {
            if (message.author.id !== process.env.OWNER) {
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

        const messageContent = message.content.toLowerCase();
        const triggers = this.loadTriggers();

        if (triggers.some(trigger => messageContent.includes(trigger))) {
            message.reply(`${message.author} nếu đang cần recommend thì nổ cái budget ra trước rồi tính tiếp :thumbsup:`);
        }
    }
};
