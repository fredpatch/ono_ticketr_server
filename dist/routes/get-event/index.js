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
exports.get_event = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../services/logs/logger");
const get_event = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { event_id, draft, mode } = req.body;
    const currentUserId = req.user;
    console.log("@@@ CURRENT USER ==> ", currentUserId); // Assuming req.user contains the current user's ID
    // Initial value, no increment if viewer is the author
    let incrementalVal = 0;
    // Find the event to determine the author before updating
    const event = yield Event_1.default.findOne({ event_id })
        .populate("author", "personal_info._id personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title description content location banner price activity startDateTime endDateTime tags publishedAt event_id");
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }
    let actualAuthor = (_a = event.author) === null || _a === void 0 ? void 0 : _a._id;
    if (!actualAuthor) {
        return res.status(500).json({ error: "Actual author not found!" });
    }
    // Only increment if the current user is not the author
    if (actualAuthor.toString() !== currentUserId) {
        incrementalVal = mode !== "edit" ? 1 : 0;
    }
    // incrementalVal = mode != "edit" ? 1 : 0;
    Event_1.default.findOneAndUpdate({ event_id }, { $inc: { "activity.total_reads": incrementalVal } })
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title description content location banner activity price startDateTime endDateTime tags publishedAt event_id")
        .then((event) => {
        var _a, _b;
        User_1.default.findOneAndUpdate({
            "personal_info.username": (_b = (_a = event === null || event === void 0 ? void 0 : event.author) === null || _a === void 0 ? void 0 : _a.personal_info) === null || _b === void 0 ? void 0 : _b.username,
        }, {
            $inc: { "account_info.total_reads": incrementalVal },
        }).catch((error) => {
            logger_1.logger.info(`@@ Error in get_event: ${error}`);
            res.status(500).json({ error: error.message });
        });
        if (event.draft && !draft) {
            return res.status(403).json({ message: "You cannot access draft !" });
        }
        logger_1.logger.info(`@@ Event fetched successfully`);
        res.status(200).json({ event });
    })
        .catch((error) => {
        logger_1.logger.info(`@@ Error in get_event: ${error}`);
        res.status(500).json({ error: error.message });
    });
});
exports.get_event = get_event;
