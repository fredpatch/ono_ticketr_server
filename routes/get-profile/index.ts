import User from "../../models/User";
import { logger } from "../../services/logs/logger";

export const get_profile = (req: any, res: any) => {
  let { username } = req.body;
  // console.log("@@ username ==>", username);
  try {
    User.findOne({ "personal_info.username": username })
      .select("-personal_info.password -google_auth -updatedAt -events")
      .then((user) => {
        if (!user) {
          logger.error("@@ User not found");
          return res.status(404).json({ error: "User not found" });
        }

        logger.info("@@ User found successfully");
        return res.status(200).json(user);
      });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: `Something went wrong when fetching user: ${error}` });
  }
};
