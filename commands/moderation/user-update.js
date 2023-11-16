const { SlashCommandBuilder } = require("discord.js");
const userMockData = require("../../data/mock-user-data.json");
const changeName = require("../../utils/change-name");
const changeRole = require("../../utils/change-role");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-update")
    .setDescription("Updates student information in server"),
  async execute(interaction) {
    try {
      await changeName(interaction, userMockData.firstname, userMockData.lastname);
      await changeRole(interaction, userMockData.cohort);
      await interaction.reply(`Your server information was updated!`);
    } catch (error) {
      console.error("Error executing user-update command:", error);
      if (error.message.includes("Missing Permissions")) {
        await interaction.reply('I do not have permission to update this user.');
      } else {
        await interaction.reply('There was an error while executing this command!');
      }
    }
  },
};
