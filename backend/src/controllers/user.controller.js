import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currUserId = req.user.id;
    const currUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currUserId } }, // Exclude current user
        { _id: { $nin: currUser.friends } }, // Exclude current user's friends
        { isOnboarded: true },
      ],
    });

    // return an array directly so frontend can call .map on the response
    res.status(200).json(recommendedUsers);
  } catch (err) {
    console.error("Error fetching recommended users:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic");

    res.status(200).json(user.friends);
  } catch (err) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    //prevent sending request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json({ friendRequest });
  } catch (err) {
    console.error("Error sending friend request:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    //verify the current user is the recipient of this request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each other to friends list
    // $addToSet operator adds a value to an array unless the value is already present, in which case it does nothing.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic");

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (err) {
    console.error("Error fetching friend requests:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ outgoingRequests });
  } catch (err) {
    console.error("Error fetching outgoing friend requests:", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
}
