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
exports.liked_event = exports.like_event = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const Notification_1 = __importDefault(require("../../models/Notification"));
const logger_1 = require("../../services/logs/logger");
const like_event = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user;
    let { _id, isLikedByUser } = req.body;
    // Check if the event is already liked by the user
    const alreadyLiked = yield Notification_1.default.exists({
        user: user_id,
        type: "like",
        event: _id,
    });
    if (isLikedByUser && !alreadyLiked) {
        return res.status(200).json({ liked_by_user: true });
    }
    else if (!isLikedByUser && alreadyLiked) {
        return res.status(200).json({ liked_by_user: false });
    }
    let incrementalVal = !isLikedByUser ? 1 : -1;
    Event_1.default.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementalVal } }).then((event) => {
        let actualEvent = event;
        if (!actualEvent) {
            return res.status(500).json({ error: "Event not found!" });
        }
        if (!isLikedByUser) {
            let like = new Notification_1.default({
                type: "like",
                event: _id,
                notification_for: actualEvent.author,
                user: user_id,
            });
            like.save().then((data) => {
                logger_1.logger.info(`@@ Event liked successfully`);
                return res.status(200).json({ liked_by_user: true });
            });
        }
        else {
            Notification_1.default.findOneAndDelete({ user: user_id, type: "like", event: _id })
                .then((data) => {
                logger_1.logger.info(`@@ One event unliked successfully`);
                return res.status(200).json({ liked_by_user: false });
            })
                .catch((err) => {
                logger_1.logger.error(`@@ Something went wrong : ${err}`);
                return res
                    .status(500)
                    .json({ error: ` Something went wrong : ${err.message}` });
            });
        }
    });
});
exports.like_event = like_event;
const liked_event = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user;
    let { _id } = req.body;
    Notification_1.default.exists({ user: user_id, type: "like", event: _id })
        .then((result) => {
        return res.status(200).json({ result });
    })
        .catch((err) => {
        logger_1.logger.error(`@@ Something went wrong : ${err}`);
        return res
            .status(500)
            .json({ error: ` Something went wrong : ${err.message}` });
    });
});
exports.liked_event = liked_event;
