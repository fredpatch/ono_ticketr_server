"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    event_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    banner_public_id: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        maxlength: 400,
        // required: true
    },
    content: {
        type: [],
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        // required: true,
        ref: "users",
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0,
        },
        // total_comments: {
        //   type: Number,
        //   default: 0,
        // },
        total_reads: {
            type: Number,
            default: 0,
        },
        // total_parent_comments: {
        //   type: Number,
        //   default: 0,
        // },
    },
    // comments: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "comments",
    //   default: [],
    // },
    draft: {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
        default: "",
    },
    startDateTime: {
        type: Date,
        default: Date.now(),
        // required: true,
    },
    endDateTime: {
        type: Date,
        default: Date.now(),
        // required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: {
        createdAt: "publishedAt",
        updatedAt: "updatedAt",
    },
});
const Event = mongoose_1.default.model("events", eventSchema);
exports.default = Event;
