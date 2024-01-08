const { SlashCommandBuilder } = require("discord.js");
const admin = require("firebase-admin");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sync")
        .setDescription("Synchronize Discord with Firebase"),

    async execute(interaction) {
        const userRef = admin.firestore().collection('students').doc(interaction.user.id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return interaction.reply('User data not found in Firebase. Please ensure the mapping is set up.');
        }

        const userData = doc.data();
        const { cohort, firstname, lastname } = userData;

        try {
          
            await changeRole(interaction, cohort);

          
            await interaction.member.setNickname(`${firstname} ${lastname}`);

            console.log(`Synchronization complete for Discord user ${interaction.user.id}`);
            interaction.reply('Your Moodle data has been synchronized with Discord.');
        } catch (error) {
            console.error(`Error during synchronization:`, error);
            interaction.reply('An error occurred during synchronization.');
        }
    },
};


async function changeRole(interaction, cohort) {
    const cohortYear = cohort.split('/').pop().trim();
    const roleName = `iss${cohortYear}`;
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (role) {
        await interaction.member.roles.add(role);
        console.log(`Role ${roleName} added to user ${interaction.user.id}`);
    } else {
        console.log(`Role ${roleName} not found for user ${interaction.user.id}`);
    }
}
