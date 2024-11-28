import express from "express";
import verifyJWT from "../utils/verifyJWT.js";
import { cacheMiddleware } from "../middlewares/cache.js";
import { authorizedRoles } from "../middlewares/roleMiddleware.js";

import {
  publish_event,
  trending_posts,
  latest_events_count,
  search_events,
  user_written_events_count,
  user_written_events,
  delete_event,
  get_event,
  get_profile,
  search_posts_count,
  change_password,
  update_user_profile,
  search_users,
  latest_events,
} from "./index.js";

const dataRouter = express.Router();

/* Public routes */
dataRouter.post("/events/latest-events", cacheMiddleware(60), latest_events);
dataRouter.post("/events/get-event", cacheMiddleware(60), get_event);
dataRouter.get("/events/trending-events", cacheMiddleware(60), trending_posts);
dataRouter.post("/events/all-latest-events-count", latest_events_count);
dataRouter.post("/events/search-posts", search_events);
dataRouter.post("/events/search-posts-count", search_posts_count);
dataRouter.post("/user/search-users", search_users);
dataRouter.post("/user/get-profile", cacheMiddleware(60), get_profile);

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/* Admin + Moderator Routes */
dataRouter.post(
  "/events/publish-event",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  publish_event
);
dataRouter.post(
  "/events/user-written-events",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  user_written_events
);
dataRouter.post(
  "/events/user-written-events-count",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  user_written_events_count
);
dataRouter.post(
  "/events/delete-event",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  delete_event
);
dataRouter.post(
  "/user/update-user-profile",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  update_user_profile
);
dataRouter.post(
  "/private/change-password",
  verifyJWT,
  authorizedRoles("admin", "moderator"),
  change_password
);

export default dataRouter;
