import Token from "../../models/Token.js";
import { generateAccessToken } from "../../utils/tokenGeneration.js";
import User from "../../models/User.js";

export const refresh_token = async (req, res) => {
  // Retrieve the refresh token from the HttpOnly cookie
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify the refresh token
    const storedToken = await Token.findOne({
      refresh_token,
    });

    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "No refresh token found, Please login again" });
    }

    if (storedToken.expiresAt < Date.now()) {
      return res
        .status(401)
        .json({ message: "Refresh token expired, Please login again" });
    }

    if (storedToken.refresh_token != refresh_token) {
      return res
        .status(401)
        .json({ message: "Invalid refresh token, Please login again" });
    }

    // generate new access token and refresh token
    const user = { id: storedToken.user._id }; // fetch user data if needed
    const registeredUser = await User.findOne({ _id: user.id }).select(
      "personal_info.username personal_info.fullname personal_info.profile_img role -_id"
    );
    const access_token = generateAccessToken(user);

    res.status(200).json({ access_token, user: registeredUser });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
