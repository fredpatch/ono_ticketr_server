import Event from "../../models/Event";
import Notification from "../../models/Notification";
import User from "../../models/User";
import { logger } from "../../services/logs/logger";
import deleteFileFromServer from "../../utils/deleteFiles";

export const delete_event = async (req: any, res: any) => {
  let user_id = req.user;
  let isAdmin = req.admin;
  let { event_id } = req.body;

  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized action." });
  }

  // Delete notifications related to the event
  try {
    const get_event = await Event.findOne({ event_id });
    if (!get_event) {
      return res.status(404).json({ message: "Event not found." });
    }
    const fileKey = get_event?.banner_public_id;
    // delete banner from uploadthing
    await deleteFileFromServer(fileKey);

    const event = await Event.findOneAndDelete({ event_id });
    if (!event) {
      logger.error("Event not found.");
      res.status(404).json({ message: "Event not found." });
    }

    await Notification.deleteMany({ event: event?._id });
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { events: event?._id },
        $inc: { "account_info.total_events": -1 },
      }
    );

    logger.info("Notifications deleted successfully.");
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting related data:", error);
    res.status(500).json({
      error: "Failed to delete event due to server error.",
    });

    return res.status(500).json({ error: "Failed to delete related data." });
  }
};

// await Event.findOneAndDelete({ event_id }).then((event) => {
//   console.log("@@ EVENT ==> ", event);
//   if (event) {
//     Notification.deleteMany({ event: event._id })
//       .then(() => {
//         res
//           .status(200)
//           .json({ message: "Event notification deleted successfully." });
//       })
//       .catch((error) => {
//         logger.log("@@ Error deleting notification ==>", error);
//         res.status(500).json({ error: error.message });
//       });

//     // Comment.deleteMany({ blog_id: blog._id })
//     // .then(() => {
//     //   logger.info(`@@ Comment delete success`);
//     // })
//     // .catch((error) => {
//     //   logger.info(`@@ Comment delete error: ${error.message}`);
//     // });

//     User.findOneAndUpdate(
//       { _id: user_id },
//       {
//         $pull: { events: event._id },
//         $inc: { "account_info.total_events": -1 },
//       }
//     )
//       .then(() => {
//         res
//           .status(200)
//           .json({ message: "Event User's deleted successfully." });
//       })
//       .catch((error) => {
//         logger.log("@@ Error deleting user's notification ==>", error);
//         res.status(500).json({ error: error.message });
//       });
//   }

//   res.status(200).json({ message: "Event deleted successfully." });
// });
