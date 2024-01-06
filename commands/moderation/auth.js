const { SlashCommandBuilder, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Authenticate with your Moodle account'),

    async execute(interaction) {
        const oauthUrl = `http://165.232.65.76/local/oauth/login.php?client_id=moodle_fpmi&response_type=code`;

        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Login to Moodle')
                    .setStyle('LINK')
                    .setURL(oauthUrl) 
            );

        
        await interaction.reply({ 
            content: 'Click the button below to log in to Moodle:', 
            components: [row], 
            ephemeral: true 
        });
    },
};
