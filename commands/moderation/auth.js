const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Authenticate with your Moodle account'),
    async execute(interaction) {
      const moodleAuthUrl = `http://165.232.65.76/local/oauth/login.php?client_id=moodle_fpmi&redirect_uri=http://165.232.65.76/admin/oauth2callback.php&response_type=code`;
      try {
        await interaction.reply({ content: `Please authenticate with Moodle, using this link: ${moodleAuthUrl}`, ephemeral: true });
      } catch (error) {
        console.error("Error executing auth command:", error);
        if (error.message.includes("Missing Permissions")) {
          await interaction.reply('I do not have permission to update this user.');
        } else {
          await interaction.reply('There was an error while executing this command!');
        }
      }
    },
  };
