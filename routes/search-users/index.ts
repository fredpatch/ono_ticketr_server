import { logger } from "../../services/logs/logger";
import User from "../../models/User";

const search_users = async (req: any, res: any) => {
  let { query } = req.body;

  console.log("query", query);

  User.find({
    "personal_info.username": new RegExp(query, "i"),
  })
    .limit(50)
    .select(
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      logger.info("@@ User found successfully");
      return res.status(200).json({ user });
    })
    .catch((error) => {
      logger.error(error);
      return res
        .status(500)
        .json({ error: `Something went wrong when fetching user: ${error}` });
    });
};

export default search_users;
