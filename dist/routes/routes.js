"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const index_1 = require("../routes/publish-event/index");
const cache_1 = require("../middlewares/cache");
const latest_events_1 = require("./latest_events");
const trending_events_1 = __importDefault(require("./trending-events"));
const latest_events_count_1 = require("./latest-events-count");
const search_events_1 = require("./search-events");
const manage_events_1 = require("./manage-events");
const delete_event_1 = require("./delete-event");
const get_event_1 = require("./get-event");
const get_profile_1 = require("./get-profile");
const search_posts_count_1 = __importDefault(require("./search-posts-count"));
const change_password_1 = require("./change-password");
const update_user_profile_1 = require("./update-user-profile");
const search_users_1 = __importDefault(require("./search-users"));
const dataRouter = express_1.default.Router();
dataRouter.post("/events/publish-event", utils_1.verifyJWT, index_1.publish_event);
dataRouter.post("/events/latest-events", (0, cache_1.cacheMiddleware)(60), latest_events_1.latest_events);
dataRouter.post("/events/get-event", get_event_1.get_event);
dataRouter.get("/events/trending-events", (0, cache_1.cacheMiddleware)(60), trending_events_1.default);
dataRouter.post("/events/all-latest-events-count", latest_events_count_1.latest_events_count);
dataRouter.post("/events/search-posts", search_events_1.search_events);
dataRouter.post("/events/search-posts-count", search_posts_count_1.default);
dataRouter.post("/events/user-written-events", utils_1.verifyJWT, manage_events_1.user_written_events);
dataRouter.post("/events/user-written-events-count", utils_1.verifyJWT, manage_events_1.user_written_events_count);
dataRouter.post("/events/delete-event", utils_1.verifyJWT, delete_event_1.delete_event);
dataRouter.post("/user/search-users", search_users_1.default);
dataRouter.post("/user/get-profile", get_profile_1.get_profile);
dataRouter.post("/user/update-user-profile", utils_1.verifyJWT, update_user_profile_1.update_user_profile);
dataRouter.post("/private/change-password", utils_1.verifyJWT, change_password_1.change_password);
exports.default = dataRouter;
// cacheMiddleware(60),
// cacheMiddleware(60),
