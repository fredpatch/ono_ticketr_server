import User from "../models/User.js";

// generate username
const generateUsername = async (email) => {
  let username = email.split("@")[0];

  // Check if the username already exists
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  });

  // Append a unique timestamp suffix if the username exists
  if (isUsernameNotUnique) {
    username += `_${Date.now().toString().slice(-5)}`;
  }

  return username;
};

export default generateUsername;
