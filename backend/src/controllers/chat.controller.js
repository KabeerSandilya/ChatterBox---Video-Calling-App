import { generateStreamToken } from "../lib/stream.js";

// Controller to generate and return a Stream token for the authenticated user

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.log("Error generating stream token:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
