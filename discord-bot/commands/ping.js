module.exports = {
    name: 'ping',
    description: 'Pong!',
    devOnly: true,
    testOnly: true,
    permissionsRequired: 'ADMINISTRATOR',
    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
};