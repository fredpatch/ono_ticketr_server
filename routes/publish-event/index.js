import cache from "memory-cache";
import validate_event from "../../utils/validate_event.js";
import { nanoid } from "nanoid";
import Event from "../../models/Event.js";
import { logger } from "../../services/logs/logger.js";
import User from "../../models/User.js";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

export const publish_event = async (req, res) => {
  let ErrorMsg = "";
  const authorId = req.user;
  let isAdmin = req.admin;

  if (isAdmin) {
    let {
      title,
      banner,
      category,
      content,
      description,
      endDateTime,
      isFree,
      location,
      price,
      startDateTime,
      tags,
      draft,
      url,
      id,
      banner_public_id,
    } = req.body;

    logger.info("@@ Start event validation...");
    // Data validation
    validate_event(
      title,
      banner,
      content,
      description,
      endDateTime,
      tags,
      location,
      price,
      startDateTime
    );
    logger.info("@@ Finished event validation...");

    // Convert tags to lowercase
    tags = tags.map((tag) => tag.toLowerCase());

    logger.info("@@ Event id generation...");
    // create an event_id
    const event_id = id || `${slugify(title, { lower: true })}-${uuidv4()}`;
    logger.info(`@@ Event id generated: ${event_id}`);

    if (id) {
      await Event.findOneAndUpdate(
        { event_id },
        {
          title,
          banner,
          banner_public_id,
          category,
          content,
          description,
          endDateTime,
          isFree,
          location,
          price,
          startDateTime,
          tags,
          draft: draft ? draft : false,
          url,
          id,
        }
      )
        .then((event) => {
          return res.status(200).json({
            message: "Event Updated Successfully !",
            id: event_id,
          });
        })
        .catch((err) => {
          ErrorMsg = `Failed to update post : ${err.message}`;
          logger.error(ErrorMsg);
          res.status(500).json({ error: ErrorMsg });
        });
    } else {
      const event = new Event({
        title,
        banner,
        banner_public_id,
        category,
        content,
        description,
        endDateTime,
        isFree,
        location,
        price,
        startDateTime,
        tags,
        draft: Boolean(draft),
        url,
        event_id,
        author: authorId,
      });

      event.save().then(async (event) => {
        let incrementVal = draft ? 0 : 1;

        await User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_events": incrementVal },
            $push: { events: event._id },
          }
        )
          .then(() => {
            cache.del("/events");
            return res.status(200).json({
              message: "Event Published Successfully !",
              id: event.event_id,
            });
          })
          .catch((err) => {
            ErrorMsg = `Failed to save post : ${err.message}`;
            logger.error(ErrorMsg);
            res.status(500).json({ error: ErrorMsg });
          });
      });
    }
  } else {
    logger.error("You are not authorized to perform this action");
    res
      .status(403)
      .json({
        success: false,
        message: "You don't have permission to perform this action",
      });
  }
};

// const event = {
//   title,
//   banner,
//   category,
//   content,
//   description,
//   endDateTime,
//   isFree,
//   location,
//   price,
//   startDateTime,
//   tags,
//   author: authorId,
//   url,
// };
