import Event from "../../models/Event.js";
import Notification from "../../models/Notification.js";
import { logger } from "../../services/logs/logger.js";

const like_event = async (req, res) => {
  let user_id = req.user;
  let { _id, isLikedByUser } = req.body;

  // Check if the event is already liked by the user
  const alreadyLiked = await Notification.exists({
    user: user_id,
    type: "like",
    event: _id,
  });

  if (isLikedByUser && !alreadyLiked) {
    return res.status(200).json({ liked_by_user: true });
  } else if (!isLikedByUser && alreadyLiked) {
    return res.status(200).json({ liked_by_user: false });
  }
  let incrementalVal = !isLikedByUser ? 1 : -1;

  Event.findOneAndUpdate(
    { _id },
    { $inc: { "activity.total_likes": incrementalVal } }
  ).then((event) => {
    let actualEvent = event;
    if (!actualEvent) {
      return res.status(500).json({ error: "Event not found!" });
    }

    if (!isLikedByUser) {
      let like = new Notification({
        type: "like",
        event: _id,
        notification_for: actualEvent.author,
        user: user_id,
      });

      like.save().then((data) => {
        logger.info(`@@ Event liked successfully`);
        return res.status(200).json({ liked_by_user: true });
      });
    } else {
      Notification.findOneAndDelete({ user: user_id, type: "like", event: _id })
        .then((data) => {
          logger.info(`@@ One event unliked successfully`);
          return res.status(200).json({ liked_by_user: false });
        })
        .catch((err) => {
          logger.error(`@@ Something went wrong : ${err}`);
          return res
            .status(500)
            .json({ error: ` Something went wrong : ${err.message}` });
        });
    }
  });
};

const liked_event = async (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;

  Notification.exists({ user: user_id, type: "like", event: _id })
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((err) => {
      logger.error(`@@ Something went wrong : ${err}`);
      return res
        .status(500)
        .json({ error: ` Something went wrong : ${err.message}` });
    });
};

export { like_event, liked_event };
