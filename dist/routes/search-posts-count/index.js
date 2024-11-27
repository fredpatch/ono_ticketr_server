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
const search_posts_count = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { tag, query, author } = req.body;
    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else if (query) {
        findQuery = { title: new RegExp(query, "i"), draft: false };
    }
    else if (author) {
        findQuery = { author, draft: false };
    }
    Event_1.default.countDocuments(findQuery)
        .then((count) => {
        logger_1.logger.info(`@@ Search posts count fetched successfully @@ ${count}`);
        res.status(200).json({ totalDocs: count });
    })
        .catch((err) => {
        logger_1.logger.error(`@@ Something went wrong : ${err}`);
        res.status(500).json({ error: ` Something went wrong : ${err.message}` });
    });
});
exports.default = search_posts_count;
