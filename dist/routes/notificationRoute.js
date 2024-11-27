"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notifications_1 = require("./notifications");
const verifyJWT_1 = __importDefault(require("../utils/verifyJWT"));
const like_event_1 = require("./like-event");
const notificationRoute = express_1.default.Router();
// get notifications state
notificationRoute.get("/new-notifications", verifyJWT_1.default, notifications_1.notification);
notificationRoute.post("/get-notifications", verifyJWT_1.default, notifications_1.get_notifications);
notificationRoute.post("/all-notifications-count", verifyJWT_1.default, notifications_1.notification_count);
notificationRoute.post("/like-event", verifyJWT_1.default, like_event_1.like_event);
notificationRoute.post("/isLiked-by-user", verifyJWT_1.default, like_event_1.liked_event);
exports.default = notificationRoute;
