const changeRole = async(interaction, cohort) => {
    
    const cohortYear = cohort.split('/').pop().trim();
    const roleName = `iss${cohortYear}`;
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    
    if (role) {
        console.log(role);
      await interaction.member.roles.add(role);
    }
}
module.exports = changeRole;