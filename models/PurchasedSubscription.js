const mongoose = require("mongoose");

const PurchasedSubscriptionSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPackage",
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    postsUsed: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    orderCode: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PurchasedSubscription",
  PurchasedSubscriptionSchema
);
