const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Authenticate with your Moodle account'),

    async execute(interaction) {
        const discordUserId = interaction.user.id;
        try {
                // User needs to authenticate
                const authUrl = `http://localhost:3000/auth?userId=${discordUserId}`;
                await interaction.reply({ 
                    content: `Please log in to Moodle to authenticate. Use this link: ${authUrl}`,
                    ephemeral: true
                });
        } catch (error) {
            console.error('Error accessing Firebase:', error);
            await interaction.reply({ 
                content: 'There was an error while trying to authenticate you with Moodle. Please try again later.',
                ephemeral: true
            });
        }
    },
};

