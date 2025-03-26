const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'hsr',
    description: 'Displays information about Honkai: Star Rail characters',

    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a character name. Usage: `?hsr <character-name>`');
        }

        const characterName = args[0].toLowerCase();

        try {
            const conesFilePath = path.join(__dirname, `../data/${characterName}-cones.json`);

            if (!fs.existsSync(conesFilePath)) {
                return message.reply(`No data found for character "${characterName}". Please check the character name and try again.`);
            }

            const conesData = JSON.parse(fs.readFileSync(conesFilePath, 'utf8'));

            const conesEmbed = new MessageEmbed()
                .setTitle(conesData.title || 'Nón Ánh Sáng')
                .setDescription(conesData.description || '')
                .setColor(conesData.color || '#FFFFFF');

            if (conesData['lc-image'] && conesData['lc-image'].trim() !== '') {
                conesEmbed.setImage(conesData['lc-image']);
            } else if (conesData.image && conesData.image.trim() !== '') {
                conesEmbed.setImage(conesData.image);
            }

            const lightCones = Array.isArray(conesData.lightCones) ? conesData.lightCones : [];
            const topLightCones = lightCones.slice(0, 4);

            const conesFields = topLightCones.map((cone, index) => {
                const position = index + 1;

                const displayName = cone['name-alt'] && cone['name-alt'].trim() !== '' ?
                    cone['name-alt'] : cone.name;

                const fieldName = `#${position} - ${displayName} (S${cone.superimposition}) - ${cone.percentage}`;

                const fieldValue = `:flag_gb: **${cone.name}**\n${cone.review}`;

                return {name: fieldName, value: fieldValue};
            });

            conesEmbed.addFields(conesFields);

            let embeds = [conesEmbed];

            try {
                const statsFilePath = path.join(__dirname, `../data/${characterName}-stats.json`);
                if (fs.existsSync(statsFilePath)) {
                    const statsData = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));

                    const statsEmbed = new MessageEmbed()
                        .setTitle(`${characterName.charAt(0).toUpperCase() + characterName.slice(1)} Stats`)
                        .setColor('#00BFFF');

                    const statsFields = [];

                    if (statsData.stats) {
                        if (statsData.stats.relicPieces) {
                            let relicMainStats = '';
                            for (const [piece, data] of Object.entries(statsData.stats.relicPieces)) {
                                if (data.stats && data.stats.length > 0) {
                                    relicMainStats += `**${piece}**: ${data.stats.map(stat => stat.name).join(', ')}\n`;
                                }
                            }
                            if (relicMainStats) {
                                statsFields.push({name: 'Relic Main Stats', value: relicMainStats});
                            }
                        }

                        if (statsData.stats.substats) {
                            statsFields.push({name: 'Substats Priority', value: statsData.stats.substats});
                        }

                        if (statsData.stats.skillsPriority) {
                            statsFields.push({name: 'Skills Priority', value: statsData.stats.skillsPriority});
                        }

                        if (statsData.stats.tracesPriority) {
                            statsFields.push({name: 'Traces Priority', value: statsData.stats.tracesPriority});
                        }

                        if (statsData.stats.endgameStats && Array.isArray(statsData.stats.endgameStats)) {
                            const formattedEndgameStats = statsData.stats.endgameStats.map(stat => {
                                const colonIndex = stat.indexOf(':');
                                if (colonIndex !== -1) {
                                    const prefix = stat.substring(0, colonIndex + 1);
                                    const value = stat.substring(colonIndex + 1);
                                    return `**${prefix}**${value}`;
                                }
                                return stat;
                            });
                            statsFields.push({name: 'Endgame Stats', value: formattedEndgameStats.join('\n')});
                        }
                    }

                    statsEmbed.addFields(statsFields);
                    embeds.push(statsEmbed);
                }
            } catch (error) {
                console.error(`Error loading stats for ${characterName}:`, error);
                message.channel.send(`Error loading stats for ${characterName}: ${error.message}`);
            }

            try {
                const relicsFilePath = path.join(__dirname, `../data/${characterName}-relics.json`);
                if (fs.existsSync(relicsFilePath)) {
                    const relicsData = JSON.parse(fs.readFileSync(relicsFilePath, 'utf8'));

                    const relicsEmbed = new MessageEmbed()
                        .setTitle(`${characterName.charAt(0).toUpperCase() + characterName.slice(1)} Relics`)
                        .setDescription('Recommended Relic Sets')
                        .setColor('#FFA500');

                    const relicsFields = [];

                    if (relicsData.relicSets && Array.isArray(relicsData.relicSets)) {
                        const topRelicSets = relicsData.relicSets.slice(0, 4);

                        topRelicSets.forEach((relic, index) => {
                            const position = index + 1;
                            const displayName = relic.nameAlt && relic.nameAlt.trim() !== '' ?
                                relic.nameAlt : relic.name;

                            const fieldName = `#${position} - ${displayName} - ${relic.percentage}`;

                            let setPieces = '';
                            if (relic.setPieces && Array.isArray(relic.setPieces)) {
                                setPieces = relic.setPieces.join(', ');
                            }

                            const fieldValue = `**${relic.name}**\nSet Pieces: ${setPieces}`;

                            relicsFields.push({name: fieldName, value: fieldValue});
                        });
                    }

                    relicsEmbed.addFields(relicsFields);
                    embeds.push(relicsEmbed);
                }
            } catch (error) {
                console.error(`Error loading relics for ${characterName}:`, error);
                message.channel.send(`Error loading relics for ${characterName}: ${error.message}`);
            }

            message.channel.send({
                content: '-# Disclaimer: Dữ liệu được tổng hợp từ build guide của Lê Bách & Prydwen.',
                embeds: [embeds[0]]
            });

            for (let i = 1; i < embeds.length; i++) {
                message.channel.send({embeds: [embeds[i]]});
            }

        } catch (error) {
            console.error(`Error in hsr command for ${characterName}:`, error);
            message.reply(`There was an error executing this command: ${error.message}`);
        }
    }
};
