const { SlashCommandBuilder } = require("discord.js");
const userMockData = require("../../data/mock-user-data.json");



module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-update")
    .setDescription("Updates student information in server"),
  async execute(interaction) {
    await interaction.member.setNickname(`${userMockData.firstname} ${userMockData.lastname}`);
    await interaction.reply("Your server name was changed!");
  },
};
