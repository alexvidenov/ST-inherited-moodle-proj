const { SlashCommandBuilder } = require("discord.js");
const userMockData = require("../../data/mock-user-data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-update")
    .setDescription("Updates student information in server"),
  async execute(interaction) {
    await interaction.member.setNickname(`${userMockData.firstname} ${userMockData.lastname}`);

    const cohortYear = userMockData.cohort.split('/').pop().trim();
    const roleName = `iss${cohortYear}`;

    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (role) {
      await interaction.member.role.add(role);
      await interaction.reply(`Your server name was changed and role ${roleName} was assigned!`);
    }
     else {
      await interaction.reply(`Your server name was changed, but role ${roleName} was not found.`);
    }
  },
};
