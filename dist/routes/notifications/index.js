"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification_count = exports.get_notifications = exports.notification = void 0;
const Notification_1 = __importDefault(require("../../models/Notification"));
const logger_1 = require("../../services/logs/logger");
const notification = (req, res) => {
    let user_id = req.user;
    Notification_1.default.exists({
        notification_for: user_id,
        seen: false,
        user: { $ne: user_id },
    })
        .then((results) => {
        if (results) {
            return res.status(200).json({ new_notification_available: true });
        }
        else {
            return res.status(200).json({ new_notification_available: false });
        }
    })
        .catch((error) => {
        logger_1.logger.log("@@ Error checking for new notifications", error);
        return res.status(500).json({ error: error.message });
    });
};
exports.notification = notification;
const get_notifications = (req, res) => {
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
    Notification_1.default.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("event", "title event_id")
        .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
        .sort({ createdAt: -1 })
        .select("createdAt type seen")
        .then((notifications) => {
        logger_1.logger.info("@@ Notifications fetched successfully", notifications);
        Notification_1.default.updateMany(findQuery, { seen: true })
            .skip(skipDocs)
            .limit(maxLimit)
            .then((result) => {
            logger_1.logger.info(`@@ Notifications marked as seen`);
        });
        res.status(200).json({ notifications });
    })
        .catch((error) => {
        logger_1.logger.error(`@@ Error while fetching notifications : ${error}`);
        return res.status(500).json({
            error: `Error while fetching notifications : ${error.message}`,
        });
    });
};
exports.get_notifications = get_notifications;
const notification_count = (req, res) => {
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
    Notification_1.default.countDocuments(findQuery)
        .then((count) => {
        logger_1.logger.info(`@@ ${count} Notification fetched successfully`);
        return res.status(200).json({ totalDocs: count });
    })
        .catch((err) => {
        logger_1.logger.error(`@@ Error while fetching count notifications : ${err}`);
        return res.status(500).json({
            error: `Error while fetching count notifications : ${err.message}`,
        });
    });
};
exports.notification_count = notification_count;
