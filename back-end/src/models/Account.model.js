const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
      maxlength: [80, "Account name too long"],
    },
    type: {
      type: String,
      enum: ["Savings","Salary","Credit Card","Investment","Cash","Other"],
      default: "Savings",
    },
    balance: {
      type: Number,
      default: 0,
    },
    last4: {
      type: String,
      default: "—",
      maxlength: 4,
    },
    color: {
      type: String,
      default: "#2563eb",
    },
    icon: {
      type: String,
      default: "building2",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);