const { SlashCommandBuilder } = require("discord.js");
const userMockData = require("../../data/mock-user-data.json");
const changeName = require("../../utils/change-name");
const changeRole = require("../../utils/change-role");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-update")
    .setDescription("Updates student information in server"),
  async execute(interaction) {
    await changeName(interaction, userMockData.firstname, userMockData.lastname);
    await changeRole(interaction, userMockData.cohort)

    await interaction.reply(`Your server information was updated!`)
  },
};
