"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../../models/Event"));
const logger_1 = require("../../services/logs/logger");
const trending_posts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // access latest posts
    yield Event_1.default.find({ draft: false })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .sort({
        "activity.total_reads": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
    })
        .select("event_id title publishedAt -_id")
        .limit(5)
        .then((events) => {
        logger_1.logger.info(`@@ Trending events fetched successfully`);
        res.status(200).json({ events: events });
    })
        .catch((err) => {
        logger_1.logger.error(`@@ Something went wrong : ${err}`);
        res.status(500).json({ error: ` Something went wrong : ${err.message}` });
    });
});
exports.default = trending_posts;
