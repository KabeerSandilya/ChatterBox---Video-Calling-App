import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or secret is missing");
}

// Only create the client if both keys are present to avoid runtime errors.
const streamClient =
  apiKey && apiSecret ? StreamChat.getInstance(apiKey, apiSecret) : null;

export const upsertStreamUser = async (userData) => {
  if (!streamClient) {
    console.error(
      "Cannot upsert Stream user: Stream client is not initialized due to missing API keys."
    );
    return null;
  }

  try {
    // upsertUsers expects an iterable (array) of user objects.
    const users = Array.isArray(userData) ? userData : [userData];
    await streamClient.upsertUsers(users);
    return userData;
  } catch (err) {
    console.error("Error upserting user to Stream:", err);
    throw err;
  }
};

export const generateStreamToken = (userId) => {
  try {
    //ensure userId is string
    const userIdStr = userId.toString();
    return streamClient ? streamClient.createToken(userIdStr) : null;
  } catch (err) {
    console.error("Error generating Stream token:", err);
  }
};
