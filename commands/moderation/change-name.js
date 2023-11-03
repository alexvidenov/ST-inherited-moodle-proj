const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-name")
    .setDescription("Changes student name in server"),
  async execute(interaction) {
    console.log("Ayo what happened");
    await interaction.reply("I don't know your name, bro");
  },
};
