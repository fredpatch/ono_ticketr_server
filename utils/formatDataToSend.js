import Token from "../models/Token.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./tokenGeneration.js";
import setRefreshTokenInCookie from "./setRefreshTokenCookie.js";

// format data to send to the client
const formatDataToSend = (user, res) => {
  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user);

  setRefreshTokenInCookie(res, refresh_token);

  // Store refresh Token in the database
  Token.create({
    user: user._id,
    refresh_token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    profile_img: user.personal_info.profile_img,
    role: user.role,
    access_token: access_token,
    // refresh_token: refresh_token,
  };
};

export default formatDataToSend;
