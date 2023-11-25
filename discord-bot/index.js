const {Client, GatewayIntentBits, Collection} = require('discord.js');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.config = require('./config.json');
client.localCommands = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const server = client.guilds.fetch(client.config.test_server);
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        client.localCommands.set(command.name, command);
    }

    server.then(async (s) => {
        await s.commands.set(Array.from(client.localCommands.values())).then(() => {
            console.log('Commands registered!');
        }).catch((err) => {
            console.log(err);
        });
    });
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        console.log("This is something unexpected, please let me know if you see this message.");
        console.log("Send me the following information: \n-------------- Start of message --------------")
        console.log(interaction)
        console.log("-------------- End of message --------------")
        return;
    }

    try {
        const commandObject = client.localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        if (commandObject.devOnly && !client.config.devs.includes(interaction.user.id)) {
            interaction.reply({
                content: 'Only developers are allowed to run this command.',
                ephemeral: true,
            });
            return;
        }

        if (commandObject.testOnly && interaction.guild.id !== client.config.test_server) {
            interaction.reply({
                content: 'This command cannot be ran here.',
                ephemeral: true,
            });
            return;
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions.',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
});

client.login(process.env.TOKEN);