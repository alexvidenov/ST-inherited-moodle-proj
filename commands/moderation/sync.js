const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');

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
  const mappingDoc = await firestore.doc(interaction.user.id).get();
  const mappingData = mappingDoc.exists ? mappingDoc.data() : null;

  if (!mappingData) {
    return interaction.reply('Mapping not found. Please set up the mapping first.');
  }

  const { discordUserId, moodleUserId } = mappingData;

  try {
    // Fetch Moodle user data based on Moodle user ID
    const moodleUserData = await fetchMoodleUserData(moodleUserId);

    // Update Moodle data based on Discord username and roles
    await updateDiscordUserData(discordUserId, moodleUserData, {
      username: interaction.user.username,
      roles: interaction.member.roles.cache.map(role => role.name),
    });

    console.log(`Synchronized data for Moodle user ${moodleUserId} with Discord user ${discordUserId}`);
    interaction.reply('Synchronization complete!');
  } catch (error) {
    console.error(`Error synchronizing data for Moodle user ${moodleUserId}:`, error);
    interaction.reply('An error occurred during synchronization.');
  }
}};

// Replace with your logic to fetch Moodle user data
async function fetchMoodleUserData(moodleUserId) {
  const response = await axios.get(`${moodle.apiEndpoint}/users/${moodleUserId}`);
  return response.data;
}

// Replace with your logic to update Moodle data
async function updateDiscordUserData(discordUserId, moodleUserData) {
  // Implement your logic to update Discord user data
  // For example, you might use the Discord.js API to update username and roles
  const user = await client.users.fetch(discordUserId);

  // Assuming moodleUserData contains fields like moodleUsername and moodleRole
  await user.setUsername(moodleUserData.moodleUsername);
  await user.roles.set([moodleUserData.moodleRole]);
}
