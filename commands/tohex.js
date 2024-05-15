module.exports = {
    name: 'tohex',
    description: 'Convert text to hexadecimal',
    execute(message, args) {
        const inputString = args.join(' ');
        const hexString = stringToHex(inputString);
        message.reply(`Hex: \`\`\`\n${hexString}\`\`\``);
    },
};

function stringToHex(str) {
    return str.split('')
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}
