const changeName = async (interaction, firstName, lastName ) => {
    await interaction.member.setNickname(`${firstName} ${lastName}`);
}
module.exports = changeName;