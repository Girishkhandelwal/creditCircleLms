import { Expo } from 'expo-server-sdk';
import getPrismaInstance from "../utils/PrismaClient.js";

let expo = new Expo();
const prisma = getPrismaInstance();

// Function to fetch Expo push tokens using Prisma
async function getAllExpoPushTokens(batchSize = 10000) {
  let tokens = [];
  let skip = 0;
  let moreRows = true;

  try {
    while (moreRows) {
      const leads = await prisma.lead.findMany({
        skip: skip,
        take: batchSize,
        distinct: ['token'],
        where: {
          token: {
            not: null
          }
        },
        select: {
          token: true
        }
      });

   
      const batchTokens = leads.map(lead => lead.token);

    
      tokens = tokens.concat(batchTokens);


      skip += batchSize;
      if (leads.length < batchSize) {
        moreRows = false;
      }
    }
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error; // re-throw error to be handled in the calling function
  }
}

// Function to send notifications in chunks
async function sendNotificationsInChunks(tokens, title, body, data) {
  let messages = [];

  for (let token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  return tickets;
}

// Function to fetch tokens and send notifications
export async function sendNotificationsToAllUsers(newOffer) {
  try {
    const BATCH_SIZE = 10000; // Adjust batch size as needed
    const expoPushTokens = await getAllExpoPushTokens(BATCH_SIZE);

    const title = newOffer.offerTitle;
    const body = newOffer.offerDescription;
    const data = { someData: 'New Offer Added' };

    for (let i = 0; i < expoPushTokens.length; i += BATCH_SIZE) {
      const batch = expoPushTokens.slice(i, i + BATCH_SIZE);
      await sendNotificationsInChunks(batch, title, body, data);
      console.log(`Sent batch ${i / BATCH_SIZE + 1}`);
    }

    console.log('All notifications sent');
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}


