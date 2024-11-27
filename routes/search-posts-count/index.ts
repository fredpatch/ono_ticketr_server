import Event from "../../models/Event";
import { logger } from "../../services/logs/logger";

const search_posts_count = async (req: any, res: any) => {
  let { tag, query, author } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  Event.countDocuments(findQuery)
    .then((count) => {
      logger.info(`@@ Search posts count fetched successfully @@ ${count}`);
      res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      logger.error(`@@ Something went wrong : ${err}`);
      res.status(500).json({ error: ` Something went wrong : ${err.message}` });
    });
};

export default search_posts_count;
