
const mongoose = require("mongoose")

const dsaProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    problemUrl: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "GeeksforGeeks", "Codeforces", "Other"],
      default: "LeetCode",
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Solved"],
      default: "Todo",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("DSAProblem", dsaProblemSchema)
