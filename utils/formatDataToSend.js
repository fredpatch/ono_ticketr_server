import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// format data to send to the client
const formatDataToSend = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  const access_token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "1h",
  });
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    role: user.role,
  };
};

export default formatDataToSend;
