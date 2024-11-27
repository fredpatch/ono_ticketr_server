import express from "express";
import { verifyJWT } from "../utils";
import { publish_event } from "../routes/publish-event/index";
import { cacheMiddleware } from "../middlewares/cache";
import { latest_events } from "./latest_events";
import trending_posts from "./trending-events";
import { latest_events_count } from "./latest-events-count";
import { search_events } from "./search-events";
import {
  user_written_events_count,
  user_written_events,
} from "./manage-events";
import { delete_event } from "./delete-event";
import { get_event } from "./get-event";
import { get_profile } from "./get-profile";
import search_posts_count from "./search-posts-count";
import { change_password } from "./change-password";
import { update_user_profile } from "./update-user-profile";
import search_users from "./search-users";

const dataRouter = express.Router();

dataRouter.post("/events/publish-event", verifyJWT, publish_event);
dataRouter.post("/events/latest-events", cacheMiddleware(60), latest_events);
dataRouter.post("/events/get-event", get_event);
dataRouter.get("/events/trending-events", cacheMiddleware(60), trending_posts);
dataRouter.post("/events/all-latest-events-count", latest_events_count);
dataRouter.post("/events/search-posts", search_events);
dataRouter.post("/events/search-posts-count", search_posts_count);
dataRouter.post("/events/user-written-events", verifyJWT, user_written_events);
dataRouter.post(
  "/events/user-written-events-count",
  verifyJWT,
  user_written_events_count
);
dataRouter.post("/events/delete-event", verifyJWT, delete_event);
dataRouter.post("/user/search-users", search_users);
dataRouter.post("/user/get-profile", get_profile);
dataRouter.post("/user/update-user-profile", verifyJWT, update_user_profile);

dataRouter.post("/private/change-password", verifyJWT, change_password);

export default dataRouter;

// cacheMiddleware(60),
// cacheMiddleware(60),
