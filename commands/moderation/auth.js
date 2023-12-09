const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const clientId = '1169574708203765780';
const guildId = '1159082534685134848';
const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [
    new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Authenticate with your Moodle account')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'auth') {
        const moodleAuthUrl = `http://moodledomain.com/local/oauth/login.php?client_id=moodle_fpmi&redirect_uri=http://165.232.65.76/admin/oauth2callback.php&response_type=code`;
        await interaction.reply({ content: `Please authenticate with Moodle using this link: ${moodleAuthUrl}`, ephemeral: true });
    }
});

client.login(token);
