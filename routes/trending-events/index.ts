import Event from "../../models/Event";
import { logger } from "../../services/logs/logger";

const trending_posts = async (req: any, res: any) => {
  // access latest posts
  await Event.find({ draft: false })
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("event_id title publishedAt -_id")
    .limit(5)
    .then((events) => {
      logger.info(`@@ Trending events fetched successfully`);
      res.status(200).json({ events: events });
    })
    .catch((err) => {
      logger.error(`@@ Something went wrong : ${err}`);
      res.status(500).json({ error: ` Something went wrong : ${err.message}` });
    });
};

export default trending_posts;
