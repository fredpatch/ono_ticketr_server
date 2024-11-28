import Event from "../../models/Event.js";
import { logger } from "../../services/logs/logger.js";

export const latest_events = async (req, res) => {
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
    logger.error("@@ Error fetching the events: " + error);
    return res.status(500).json({
      success: false,
      message: "[ERROR FETCHING LATEST EVENTS]",
    });
  }
};
