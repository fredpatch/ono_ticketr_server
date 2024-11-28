import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["valid", "used", "refunded", "cancelled"],
      default: "valid",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    event: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "events",
    },
  },
  {
    timestamps: {
      createdAt: "purchasedAt",
      updatedAt: "updatedAt",
    },
  }
);

const Ticket = mongoose.model("tickets", ticketSchema);

export default Ticket;
