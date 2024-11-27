import Event from "../../models/Event";
import User from "../../models/User";
import { logger } from "../../services/logs/logger";

export const get_event = async (req: any, res: any) => {
  let { event_id, draft, mode } = req.body;
  const currentUserId = req.user;
  console.log("@@@ CURRENT USER ==> ", currentUserId); // Assuming req.user contains the current user's ID

  // Initial value, no increment if viewer is the author
  let incrementalVal = 0;

  // Find the event to determine the author before updating
  const event = await Event.findOne({ event_id })
    .populate(
      "author",
      "personal_info._id personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .select(
      "title description content location banner price activity startDateTime endDateTime tags publishedAt event_id"
    );

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  let actualAuthor = event.author?._id;
  if (!actualAuthor) {
    return res.status(500).json({ error: "Actual author not found!" });
  }

  // Only increment if the current user is not the author
  if (actualAuthor.toString() !== currentUserId) {
    incrementalVal = mode !== "edit" ? 1 : 0;
  }

  // incrementalVal = mode != "edit" ? 1 : 0;

  Event.findOneAndUpdate(
    { event_id },
    { $inc: { "activity.total_reads": incrementalVal } }
  )
    .populate(
      "author",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .select(
      "title description content location banner activity price startDateTime endDateTime tags publishedAt event_id"
    )
    .then((event: any) => {
      User.findOneAndUpdate(
        {
          "personal_info.username": event?.author?.personal_info?.username,
        },
        {
          $inc: { "account_info.total_reads": incrementalVal },
        }
      ).catch((error) => {
        logger.info(`@@ Error in get_event: ${error}`);
        res.status(500).json({ error: error.message });
      });

      if (event.draft && !draft) {
        return res.status(403).json({ message: "You cannot access draft !" });
      }

      logger.info(`@@ Event fetched successfully`);
      res.status(200).json({ event });
    })
    .catch((error) => {
      logger.info(`@@ Error in get_event: ${error}`);
      res.status(500).json({ error: error.message });
    });
};
