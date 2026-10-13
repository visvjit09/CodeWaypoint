
const mongoose = require("mongoose")

const lessonBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
      required: true,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
)

// A user can have only one record for each lesson.
lessonBookmarkSchema.index(
  { userId: 1, subSectionId: 1 },
  { unique: true }
)

module.exports = mongoose.model("LessonBookmark", lessonBookmarkSchema)
