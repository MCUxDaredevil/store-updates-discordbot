const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Purge all the commands in the bot',
    devOnly: true,
    testOnly: true,
    permissionsRequired: 'ADMINISTRATOR',
    rolesAllowed: ['819311945433088010'],
    callback: async (client, interaction) => {
        console.log(`DANGER: "${interaction.user.tag}" is purging the commands for "${interaction.guild.name}".`);

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Purge')
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: '⚠️ DANGER ⚠️\n\n**Purging cannot be undone. Are you sure about this?**',
            components: [row],
        });
        let confirmation = null
        try {
            confirmation = await response.awaitMessageComponent({
                filter: (i) => i.user.id === interaction.user.id,
                time: 20000
            });
        } catch (e) {
            await interaction.editReply({
                content: 'Confirmation not received , cancelling',
                components: []
            });
            return;
        }

        if (confirmation.customId === 'confirm') {
            await interaction.editReply({
                content: 'Purging commands...',
                components: []
            });
            await client.application.commands.set([], client.config.test_server);
            await interaction.editReply({
                content: 'Commands purged',
                components: []
            });
        } else {
            await interaction.editReply({
                content: 'Purge Cancelled',
                components: []
            });
        }
    },
};