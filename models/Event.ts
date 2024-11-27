import mongoose, { Schema } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: {
      createdAt: "publishedAt",
      updatedAt: "updatedAt",
    },
  }
);

const Event = mongoose.model("events", eventSchema);

export default Event;
