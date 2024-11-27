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
exports.latest_events = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const logger_1 = require("../../services/logs/logger");
const latest_events = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let maxLimit = 5;
    try {
        let { page } = req.body;
        //logs
        logger_1.logger.info(`Fetching latest events...`);
        yield Event_1.default.find({ draft: false })
            .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img -_id")
            .sort({ publishAt: -1 })
            .select("event_id title description price location startDateTime endDateTime banner activity tags publishedAt -_id")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit)
            .then((events) => {
            logger_1.logger.info(`@@ Latest events fetched successfully`);
            return res.status(200).json({ events: events });
        });
    }
    catch (error) {
        logger_1.logger.error("@@ Error in get_events: " + error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
});
exports.latest_events = latest_events;
