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
exports.publish_event = void 0;
const memory_cache_1 = __importDefault(require("memory-cache"));
const Event_1 = __importDefault(require("../../models/Event"));
const logger_1 = require("../../services/logs/logger");
const User_1 = __importDefault(require("../../models/User"));
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("slugify"));
const publish_event = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ErrorMsg = "";
    const authorId = req.user;
    let isAdmin = req.admin;
    if (isAdmin) {
        let { title, banner, category, content, description, endDateTime, isFree, location, price, startDateTime, tags, draft, url, id, banner_public_id } = req.body;
        console.log("Image file key sent to server: ", banner_public_id);
        // Data validation
        // validate_event(
        //   title,
        //   banner,
        //   content,
        //   description,
        //   endDateTime,
        //   tags,
        //   location,
        //   price,
        //   startDateTime
        // );
        // Convert tags to lowercase
        tags = tags.map((tag) => tag.toLowerCase());
        // create an event_id
        const event_id = id || `${(0, slugify_1.default)(title, { lower: true })}-${(0, uuid_1.v4)()}`;
        if (id) {
            yield Event_1.default.findOneAndUpdate({
                event_id,
            }, {
                title,
                banner,
                banner_public_id,
                category,
                content,
                description,
                endDateTime,
                isFree,
                location,
                price,
                startDateTime,
                tags,
                draft: draft ? draft : false,
                url,
                id,
            })
                .then((event) => {
                return res.status(200).json({
                    message: "Event Updated Successfully !",
                    id: event_id,
                });
            })
                .catch((err) => {
                ErrorMsg = `Failed to update post : ${err.message}`;
                logger_1.logger.error(ErrorMsg);
                res.status(500).json({ error: ErrorMsg });
            });
        }
        else {
            const event = new Event_1.default({
                title,
                banner,
                banner_public_id,
                category,
                content,
                description,
                endDateTime,
                isFree,
                location,
                price,
                startDateTime,
                tags,
                draft: Boolean(draft),
                url,
                event_id,
                author: authorId,
            });
            event.save().then((event) => __awaiter(void 0, void 0, void 0, function* () {
                let incrementVal = draft ? 0 : 1;
                yield User_1.default.findOneAndUpdate({ _id: authorId }, {
                    $inc: { "account_info.total_events": incrementVal },
                    $push: { events: event._id },
                })
                    .then(() => {
                    memory_cache_1.default.del("/events");
                    return res.status(200).json({
                        message: "Event Published Successfully !",
                        id: event.event_id,
                    });
                })
                    .catch((err) => {
                    ErrorMsg = `Failed to save post : ${err.message}`;
                    logger_1.logger.error(ErrorMsg);
                    res.status(500).json({ error: ErrorMsg });
                });
            }));
        }
    }
    else {
        logger_1.logger.error("You are not authorized to perform this action");
        res
            .status(403)
            .json({ error: "You don't have permission to perform this action" });
    }
});
exports.publish_event = publish_event;
// const event = {
//   title,
//   banner,
//   category,
//   content,
//   description,
//   endDateTime,
//   isFree,
//   location,
//   price,
//   startDateTime,
//   tags,
//   author: authorId,
//   url,
// };
