const { SlashCommandBuilder, MessageActionRow, MessageButton } = require('discord.js');
const firebaseAdmin = require('firebase-admin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Authenticate with your Moodle account'),

    async execute(interaction) {
        const discordUserId = interaction.user.id;
        const userRef = firebaseAdmin.firestore().collection('students').doc(discordUserId);

        try {
            const doc = await userRef.get();
            if (doc.exists && doc.data().code) {
                const moodleAccessToken = doc.data().code;
                const moodleLoggedInUrl = `http://165.232.65.76/your_logged_in_page?access_token=${moodleAccessToken}`;

                await interaction.reply({ 
                    content: `You're already authenticated. Click here to access your Moodle site: ${moodleLoggedInUrl}`,
                    ephemeral: true
                });
            } else {
                // User needs to authenticate
                const authUrl = `http://localhost:3000/auth?userId=${discordUserId}`;
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Authenticate with Moodle')
                            .setStyle('LINK')
                            .setURL(authUrl)
                    );

                await interaction.reply({ 
                    content: 'Please click the button below to log in to Moodle and authenticate:',
                    components: [row],
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error accessing Firebase:', error);
            await interaction.reply({ 
                content: 'There was an error while trying to authenticate you with Moodle. Please try again later.',
                ephemeral: true
            });
        }
    },
};
