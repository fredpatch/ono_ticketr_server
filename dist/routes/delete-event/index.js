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
exports.delete_event = void 0;
const Event_1 = __importDefault(require("../../models/Event"));
const Notification_1 = __importDefault(require("../../models/Notification"));
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../services/logs/logger");
const deleteFiles_1 = __importDefault(require("../../utils/deleteFiles"));
const delete_event = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user;
    let isAdmin = req.admin;
    let { event_id } = req.body;
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized action." });
    }
    // Delete notifications related to the event
    try {
        const get_event = yield Event_1.default.findOne({ event_id });
        if (!get_event) {
            return res.status(404).json({ message: "Event not found." });
        }
        const fileKey = get_event === null || get_event === void 0 ? void 0 : get_event.banner_public_id;
        // delete banner from uploadthing
        yield (0, deleteFiles_1.default)(fileKey);
        const event = yield Event_1.default.findOneAndDelete({ event_id });
        if (!event) {
            logger_1.logger.error("Event not found.");
            res.status(404).json({ message: "Event not found." });
        }
        yield Notification_1.default.deleteMany({ event: event === null || event === void 0 ? void 0 : event._id });
        yield User_1.default.findOneAndUpdate({ _id: user_id }, {
            $pull: { events: event === null || event === void 0 ? void 0 : event._id },
            $inc: { "account_info.total_events": -1 },
        });
        logger_1.logger.info("Notifications deleted successfully.");
        return res.status(200).json({ message: "Event deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting related data:", error);
        res.status(500).json({
            error: "Failed to delete event due to server error.",
        });
        return res.status(500).json({ error: "Failed to delete related data." });
    }
});
exports.delete_event = delete_event;
// await Event.findOneAndDelete({ event_id }).then((event) => {
//   console.log("@@ EVENT ==> ", event);
//   if (event) {
//     Notification.deleteMany({ event: event._id })
//       .then(() => {
//         res
//           .status(200)
//           .json({ message: "Event notification deleted successfully." });
//       })
//       .catch((error) => {
//         logger.log("@@ Error deleting notification ==>", error);
//         res.status(500).json({ error: error.message });
//       });
//     // Comment.deleteMany({ blog_id: blog._id })
//     // .then(() => {
//     //   logger.info(`@@ Comment delete success`);
//     // })
//     // .catch((error) => {
//     //   logger.info(`@@ Comment delete error: ${error.message}`);
//     // });
//     User.findOneAndUpdate(
//       { _id: user_id },
//       {
//         $pull: { events: event._id },
//         $inc: { "account_info.total_events": -1 },
//       }
//     )
//       .then(() => {
//         res
//           .status(200)
//           .json({ message: "Event User's deleted successfully." });
//       })
//       .catch((error) => {
//         logger.log("@@ Error deleting user's notification ==>", error);
//         res.status(500).json({ error: error.message });
//       });
//   }
//   res.status(200).json({ message: "Event deleted successfully." });
// });
