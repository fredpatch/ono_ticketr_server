"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_event = ({ title, des, content, tags, banner, draft, res, }) => {
    if (!draft) {
        if (!des.length || des.length > 400) {
            res.status(403).json({
                error: "The description provided must be under 400 characters",
            });
            throw new Error("@@[Thrown] The description provided must be under 200 characters");
        }
        if (!banner.length) {
            res.status(403).json({
                error: "You must provide a banner for your post",
            });
            throw new Error("@@[Thrown] You must provide a banner to publish your post");
        }
        if (!content.blocks.length) {
            res.status(403).json({
                error: "You must provide content for your post",
            });
            throw new Error("@@[Thrown] You must provide some content to publish your post");
        }
        if (!tags.length || tags.length > 10) {
            res.status(403).json({
                error: "The tags provided must not exceed 10",
            });
            throw new Error("@@[Thrown] The tags provided must not exceed 10");
        }
    }
    if (!title.length) {
        res.status(403).json({
            error: "You must provide a title for your post",
        });
        throw new Error("@@[Thrown] You must provide a title for your post");
    }
};
exports.default = validate_event;
