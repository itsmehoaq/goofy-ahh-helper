module.exports = {
    name: 'totext',
    description: 'convert hex to text',
    execute(message, args) {
        const hexString = args.join(' ');
        try {
            const normalString = hexToString(hexString);
            message.reply(`${normalString}`);
        } catch (error) {
            message.reply('Invalid hex string.');
        }
    },
};

function hexToString(hex) {
    const cleanedHex = hex.replace(/\s+/g, '');
    return cleanedHex.match(/.{1,2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('');
}