import Event from "../../models/Event";
import { logger } from "../../services/logs/logger";

export const latest_events = async (req: any, res: any) => {
  let maxLimit = 5;
  try {
    let { page } = req.body;

    //logs
    logger.info(`Fetching latest events...`);
    await Event.find({ draft: false })
      .populate(
        "author",
        "personal_info.fullname personal_info.username personal_info.profile_img -_id"
      )
      .sort({ publishAt: -1 })
      .select(
        "event_id title description price location startDateTime endDateTime banner activity tags publishedAt -_id"
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .then((events) => {
        logger.info(`@@ Latest events fetched successfully`);
        return res.status(200).json({ events: events });
      });
  } catch (error) {
    logger.error("@@ Error in get_events: " + error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
