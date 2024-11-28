import Event from "../../models/Event.js";
import { logger } from "../../services/logs/logger.js";

export const latest_events_count = async (req, res) => {
  Event.countDocuments({ draft: false })
    .then((count) => {
      logger.info(`@@ Latest events count fetched successfully`);
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      logger.error(`@@ Something went wrong : ${err}`);
      return res.status(500).json({
        success: false,
        message: "Something went wrong!",
      });
    });
};
