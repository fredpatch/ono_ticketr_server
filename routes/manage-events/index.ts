import Event from "../../models/Event";
import { logger } from "../../services/logs/logger";

export const user_written_events = async (req: any, res: any) => {
  let user_id = req.user;
  let { page, draft, query, deletedDocCount } = req.body;

  let maxLimit = 5;
  let skipDocs = (page - 1) * maxLimit;

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Event.find({
    author: user_id,
    draft,
    title: new RegExp(query, "i"),
  })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select(
      "event_id title description banner activity tags draft publishedAt -_id"
    )
    .then((events) => {
      logger.info("@@ EVENTS fetched successfully");
      res.status(200).json({ events });
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).json({ error: error.message });
    });
};

export const user_written_events_count = (req: any, res: any) => {
  let user_id = req.user;

  let { draft, query } = req.body;

  Event.countDocuments({
    author: user_id,
    draft,
    title: new RegExp(query, "i"),
  })
    .then((count) => {
      // logger.info(`@@ Events count => ${count}`);
      logger.info(`@@ Events count fetched successfully`);
      res.status(200).json({ totalDocs: count });
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).json({ error: error.message });
    });
};
