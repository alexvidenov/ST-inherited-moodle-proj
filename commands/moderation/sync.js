const { SlashCommandBuilder, Client } = require("discord.js");
const admin = require("firebase-admin");

module.exports = {
  //the SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("Synchronizing Discord with Moodle"),
  //----------------------------------------------------------------------------
  async execute(interaction) {
  // Check if the user has the 'ADMINISTRATOR' permission
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    return interaction.reply('You do not have permission to use this command.');
  }

  // Fetch the mapping data from Firestore
  const userSnap = await admin.firestore().collection('students').where('discordUserId','==',interaction.user.id).get();
  const userData = !userSnap.empty ? userSnap.docs[0].data() : null;

  if (!userData) {
    return interaction.reply('Mapping not found. Please set up the mapping first.');
  }

  const { discordUserId, moodleUserId } = userData;

  try {
    // // Fetch Moodle user data based on Moodle user ID
    // const moodleUserData = await fetchMoodleUserData(moodleUserId);

    // Update Moodle data based on Discord username and roles
    await updateDiscordUserData(discordUserId, userData);

    console.log(`Synchronized data for Moodle user ${moodleUserId} with Discord user ${discordUserId}`);
    interaction.reply('Synchronization complete!');
  } catch (error) {
    console.error(`Error synchronizing data for Moodle user ${moodleUserId}:`, error);
    interaction.reply('An error occurred during synchronization.');
  }
}};

// Replace with your logic to update Moodle data
async function updateDiscordUserData(discordUserId, moodleUserData) {
  // Implement your logic to update Discord user data
  // For example, you might use the Discord.js API to update username and roles
  const user = await Client.users.fetch(discordUserId);

  // Assuming moodleUserData contains fields like moodleUsername and moodleRole
  await user.setUsername(moodleUserData.moodleUsername);
  await user.roles.set([moodleUserData.moodleRole]);
}
