import Notification from "../../models/Notification";
import { logger } from "../../services/logs/logger";

const notification = (req: any, res: any) => {
  let user_id = req.user;

  Notification.exists({
    notification_for: user_id,
    seen: false,
    user: { $ne: user_id },
  })
    .then((results: any) => {
      if (results) {
        return res.status(200).json({ new_notification_available: true });
      } else {
        return res.status(200).json({ new_notification_available: false });
      }
    })
    .catch((error: any) => {
      logger.log("@@ Error checking for new notifications", error);
      return res.status(500).json({ error: error.message });
    });
};

const get_notifications = (req: any, res: any) => {
  let user_id = req.user;

  let { page, filter, deletedDocCount } = req.body;

  // console.log("@@ GET NOTIFICATIONS ==> server res",page, filter, deletedDocCount);

  let maxLimit = 10;
  let findQuery = {
    notification_for: user_id,
    user: { $ne: user_id },
    type: { $in: ["like"] },
  };
  let skipDocs = (page - 1) * maxLimit;

  if (filter != "all") {
    findQuery.type = filter;
  }

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("event", "title event_id")
    .populate(
      "user",
      "personal_info.fullname personal_info.username personal_info.profile_img"
    )
    .sort({ createdAt: -1 })
    .select("createdAt type seen")
    .then((notifications) => {
      logger.info("@@ Notifications fetched successfully", notifications);

      Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then((result) => {
          logger.info(`@@ Notifications marked as seen`);
        });

      res.status(200).json({ notifications });
    })
    .catch((error) => {
      logger.error(`@@ Error while fetching notifications : ${error}`);
      return res.status(500).json({
        error: `Error while fetching notifications : ${error.message}`,
      });
    });
};

const notification_count = (req: any, res: any) => {
  let user_id = req.user;

  let { filter } = req.body;

  let findQuery = {
    notification_for: user_id,
    user: { $ne: user_id },
    type: { $in: ["like"] },
  };

  if (filter != "all") {
    findQuery.type = filter;
  }

  Notification.countDocuments(findQuery)
    .then((count) => {
      logger.info(`@@ ${count} Notification fetched successfully`);
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      logger.error(`@@ Error while fetching count notifications : ${err}`);
      return res.status(500).json({
        error: `Error while fetching count notifications : ${err.message}`,
      });
    });
};

export { notification, get_notifications, notification_count };
