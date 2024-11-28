import express from "express";
import {
  get_notifications,
  notification,
  notification_count,
} from "./notifications/index.js";
import verifyJWT from "../utils/verifyJWT.js";
import { like_event, liked_event } from "./like-event/index.js";

const notificationRoute = express.Router();

// get notifications state
notificationRoute.get("/new-notifications", verifyJWT, notification);
notificationRoute.post("/get-notifications", verifyJWT, get_notifications);
notificationRoute.post(
  "/all-notifications-count",
  verifyJWT,
  notification_count
);
notificationRoute.post("/like-event", verifyJWT, like_event);
notificationRoute.post("/isLiked-by-user", verifyJWT, liked_event);

export default notificationRoute;
