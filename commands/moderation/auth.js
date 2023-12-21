const { SlashCommandBuilder } = require('discord.js');
const firebaseAdmin = require('firebase-admin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auth')
        .setDescription('Authenticate with your Moodle account or get your Moodle ID'),
    async execute(interaction) {
        const discordUserId = interaction.user.id; 
        const db = firebaseAdmin.firestore();

        try {
            const docRef = db.collection('students').doc(discordUserId);
            const doc = await docRef.get();

            if (doc.exists && doc.data().moodle_id) {
                // The document exists and has a moodle_id, so reply
                const moodleProfileUrl = `http://165.232.65.76/user/profile.php?id=${doc.data().moodle_id}`;
                 await interaction.reply({ content: `Click here to view your Moodle profile: ${moodleProfileUrl}`, ephemeral: true });

            } else {
                // If no Moodle ID is found, provide instructions to log in
                const moodleLoginUrl = `http://165.232.65.76/login`;
                await interaction.reply({ content: `Please log in to Moodle using this link: ${moodleLoginUrl}, and after that run the command again`, ephemeral: true });
            }
        } catch (error) {
            console.error("Error in Moodle command:", error);
            await interaction.reply({ content: `There was an error processing your request.`, ephemeral: true });
        }
    },
};
