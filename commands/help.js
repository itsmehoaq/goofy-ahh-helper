const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'help', description: 'như tên.', execute(message, args) {
        const {commands} = message.client;
        let embed
        switch (args[0]) {
            case 'tohex':
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('tohex')
                    .addFields({name: 'wat do', value: 'convert text to hex'}, {name: 'usage limit', value: 'everyone'})
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                break;
            case 'totext':
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('totext')
                    .addFields({name: 'wat do', value: 'convert hex to text'}, {name: 'usage limit', value: 'everyone'})
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                break;
            case 'xinlink':
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('xinlink')
                    .addFields({name: 'wat do', value: 'xin sốt'}, {
                        name: 'usage limit', value: 'everyone, chỉ hoạt động khi reply tin nhắn bằng lệnh này'
                    })
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                break;
            case 'gasnotify':
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('gasnotify')
                    .addFields({name: 'wat do', value: 'thông báo giá xăng'}, {
                        name: 'usage limit', value: 'bot owner'
                    })
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                break;
            case 'gasupdate':
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('gasupdate')
                    .addFields({
                        name: 'wat do', value: 'cập nhật file giá xăng'
                    }, {name: 'usage limit', value: 'bot owner'})
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                break;
            default:
                embed = new MessageEmbed()
                    .setColor('#e3e289')
                    .setTitle('wat the car doing')
                    .setDescription('dùng \`?help <command_name>\` để biết thêm thông tin về command')
                    .setFooter({text: 'powered by HoaqGPT \u2122'});
                commands.forEach(command => {
                    embed.addField(`**${command.name}**`, `${command.description}`);
                });
                break;
        }
        message.channel.send({embeds: [embed]});
    },
}

