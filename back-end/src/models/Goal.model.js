const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
      maxlength: [80, "Goal name too long"],
    },
    target: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target must be greater than 0"],
    },
    saved: {
      type: Number,
      default: 0,
      min: [0, "Saved amount cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    icon: {
      type: String,
      default: "target",
    },
    color: {
      type: String,
      default: "#2563eb",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);