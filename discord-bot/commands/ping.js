module.exports = {
    name: 'ping',
    description: 'Pong Me Daddy!',
    devOnly: true,
    testOnly: true,
    permissionsRequired: 'ADMINISTRATOR',
    botPermissions: 'ADMINISTRATOR',
    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
};