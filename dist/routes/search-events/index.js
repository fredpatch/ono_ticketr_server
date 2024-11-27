"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_events = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const logger_1 = require("../../services/logs/logger");
const search_events = (req, res) => {
    let { tag, page, query, author, limit, eliminate_event } = req.body;
    let findQuery = {};
    if (tag) {
        findQuery = { tags: tag, draft: false, event_id: { $ne: eliminate_event } };
    }
    else if (query) {
        findQuery = { title: new RegExp(query, "i"), draft: false };
    }
    else if (author) {
        findQuery = { author, draft: false };
    }
    let maxLimit = limit ? limit : 2;
    Event_1.default.find(findQuery)
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .sort({ publishedAt: -1 })
        .select("event_id title description banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((events) => {
        logger_1.logger.info(`@@ Search posts fetched successfully`);
        res.status(200).json({ events });
    })
        .catch((err) => {
        logger_1.logger.error(`@@ Something went wrong : ${err}`);
        res.status(500).json({ error: ` Something went wrong : ${err.message}` });
    });
};
exports.search_events = search_events;
