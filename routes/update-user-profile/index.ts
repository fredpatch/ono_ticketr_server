import User from "../../models/User";
import { logger } from "../../services/logs/logger";

export const update_user_profile = async (req: any, res: any) => {
  let { username, bio, social_links } = req.body;

  let bioLimit = 150;
  if (username.length < 3) {
    logger.info("@@ Username must be at least 3 characters long");
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }

  if (bio.length > bioLimit) {
    return res
      .status(400)
      .json({ error: "Bio should be less than bioLimit characters long" });
  }

  let socialLinksArray = Object.keys(social_links);

  try {
    for (let i = 0; i < socialLinksArray.length; i++) {
      if (social_links[socialLinksArray[i]].length) {
        let hostname = new URL(social_links[socialLinksArray[i]]).hostname;

        if (
          !hostname.includes(`${socialLinksArray[i]}.com`) &&
          socialLinksArray[i] != "website"
        ) {
          return res.status(403).json({
            error: `${socialLinksArray[i]} must be a valid ${socialLinksArray[i]}.com full link`,
          });
        }
      }
    }
  } catch (error) {
    logger.error(`Error validating social links: ${error}`);
    res.status(500).json({
      error: `You must provide some social links with http(s) included`,
    });
  }

  let UpdateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  User.findOneAndUpdate(
    {
      _id: req.user,
    },
    UpdateObj,
    {
      runValidators: true,
    }
  )
    .then(() => {
      logger.info(`@@ User Profile updated successfully`);
      res.status(200).json({ username });
    })
    .catch((err) => {
      logger.error(err.message);
      if (err.code === 11000) {
        return res.status(409).json({ error: "Username already taken" });
      }

      res.status(500).json({
        error: `Something went wrong when updating user profile : ${err.message}`,
      });
    });
};
