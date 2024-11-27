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
let profile_imgs_name_list = [
    "Garfield",
    "Tinkerbell",
    "Annie",
    "Loki",
    "Cleo",
    "Angel",
    "Bob",
    "Mia",
    "Coco",
    "Gracie",
    "Bear",
    "Bella",
    "Abby",
    "Harley",
    "Cali",
    "Leo",
    "Luna",
    "Jack",
    "Felix",
    "Kiki",
];
let profile_imgs_collections_list = [
    "notionists-neutral",
    "adventurer-neutral",
    "fun-emoji",
];
const userSchema = new mongoose_1.default.Schema({
    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, "fullname must be 3 letters long"],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: String,
        username: {
            type: String,
            minlength: [3, "Username must be 3 letters long"],
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [200, "Bio should not be more than 200"],
            default: "",
        },
        profile_img: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
            },
        },
    },
    admin: {
        type: Boolean,
        default: false,
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        tiktok: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
    },
    account_info: {
        total_events: {
            type: Number,
            default: 0,
        },
        total_reads: {
            type: Number,
            default: 0,
        },
    },
    google_auth: {
        type: Boolean,
        default: false,
    },
    events: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "events",
        default: [],
    },
}, {
    timestamps: {
        createdAt: "joinedAt",
        updatedAt: "updatedAt",
    },
});
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
