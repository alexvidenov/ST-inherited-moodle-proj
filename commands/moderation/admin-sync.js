const Discord = require('discord.js');
const admin = require('firebase-admin');
const axios = require('axios');


const client = new Discord.Client();

// Initialize Firebase
const serviceAccount = require('path/to/your/firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com',
});

const firestore = admin.firestore();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/sync')) {
    // Check if the user has the 'ADMINISTRATOR' permission
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('You do not have permission to use this command.');
    }

    const guildId = message.guild.id;

    // Fetch all users from the Firebase Firestore
    const usersSnapshot = await firestore.collection('users').where('guildId', '==', guildId).get();

    // Iterate through each user in the guild
    usersSnapshot.forEach(async (userDoc) => {
      const discordUserId = userDoc.id;
      const discordAccessToken = userDoc.data().discordAccessToken;

      try {
        // Authenticate with Moodle OAuth2
        const moodleAccessToken = await authenticateWithMoodle(discordAccessToken);

        if (moodleAccessToken) {
          // Fetch Discord user data
          const discordUserData = await getDiscordUserData(discordAccessToken);

          // Fetch Moodle user data
          const moodleUserData = await getMoodleUserData(moodleAccessToken);

          // Synchronize data between Discord and Moodle
          await synchronizeUserData(discordUserId, discordUserData, moodleUserData);

          console.log(`Synchronized data for user ${discordUserId}`);
        } else {
          console.error(`Failed to authenticate with Moodle for user ${discordUserId}`);
        }
      } catch (error) {
        console.error(`Error syncing data for user ${discordUserId}:`, error);
      }
    });

    message.reply('Synchronization complete for all users!');
  }
});

async function authenticateWithMoodle(discordAccessToken) {
  try {
    const response = await axios.post('moodle_oauth2_token_endpoint', {
      grant_type: 'authorization_code',
      client_id: 'moodle_client_id',
      client_secret: 'moodle_client_secret',
      code: discordAccessToken,
      redirect_uri: 'your_discord_redirect_uri',
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error authenticating with Moodle:', error);
    return null;
  }
}

async function getDiscordUserData(discordAccessToken) {
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Discord user data:', error);
    return null;
  }
}

async function getMoodleUserData(moodleAccessToken) {
  try {
    const response = await axios.get('moodle_api_user_endpoint', {
      headers: {
        Authorization: `Bearer ${moodleAccessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Moodle user data:', error);
    return null;
  }
}

async function synchronizeUserData(discordUserId, discordUserData, moodleUserData) {
  // Your synchronization logic goes here
  // Update Discord roles, channels, or any other relevant data based on Moodle data

  // Update Firebase Firestore with the latest data
  await firestore.collection('users').doc(discordUserId).update({
    discordUserData,
    moodleUserData,
  });
}

client.login('YOUR_DISCORD_BOT_TOKEN');