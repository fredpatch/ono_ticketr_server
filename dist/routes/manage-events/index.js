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
exports.user_written_events_count = exports.user_written_events = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const logger_1 = require("../../services/logs/logger");
const user_written_events = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user;
    let { page, draft, query, deletedDocCount } = req.body;
    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;
    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }
    Event_1.default.find({
        author: user_id,
        draft,
        title: new RegExp(query, "i"),
    })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 })
        .select("event_id title description banner activity tags draft publishedAt -_id")
        .then((events) => {
        logger_1.logger.info("@@ EVENTS fetched successfully");
        res.status(200).json({ events });
    })
        .catch((error) => {
        logger_1.logger.error(error);
        res.status(500).json({ error: error.message });
    });
});
exports.user_written_events = user_written_events;
const user_written_events_count = (req, res) => {
    let user_id = req.user;
    let { draft, query } = req.body;
    Event_1.default.countDocuments({
        author: user_id,
        draft,
        title: new RegExp(query, "i"),
    })
        .then((count) => {
        // logger.info(`@@ Events count => ${count}`);
        logger_1.logger.info(`@@ Events count fetched successfully`);
        res.status(200).json({ totalDocs: count });
    })
        .catch((error) => {
        logger_1.logger.error(error);
        res.status(500).json({ error: error.message });
    });
};
exports.user_written_events_count = user_written_events_count;
