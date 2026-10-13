
const mongoose = require("mongoose")
const LessonBookmark = require("../models/LessonBookmark")
const SubSection = require("../models/Subsection")

// Get all bookmarks and notes belonging to the logged-in user
exports.getMyLessonBookmarks = async (req, res) => {
  try {
    const records = await LessonBookmark.find({
      userId: req.user.id,
    })
      .populate("subSectionId", "title description videoUrl timeDuration")
      .sort({ updatedAt: -1 })

    return res.status(200).json({
      success: true,
      data: records,
    })
  } catch (error) {
    console.error("Get lesson bookmarks failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not retrieve bookmarks and notes",
    })
  }
}

// Get saved bookmark and notes for a particular lesson
exports.getLessonBookmark = async (req, res) => {
  try {
    const { subSectionId } = req.params

    if (!mongoose.isValidObjectId(subSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      })
    }

    const record = await LessonBookmark.findOne({
      userId: req.user.id,
      subSectionId,
    })

    return res.status(200).json({
      success: true,
      data: record || {
        subSectionId,
        isBookmarked: false,
        notes: "",
      },
    })
  } catch (error) {
    console.error("Get lesson bookmark failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not retrieve lesson bookmark",
    })
  }
}

// Create or update a bookmark and/or personal notes
exports.saveLessonBookmark = async (req, res) => {
  try {
    const { subSectionId } = req.params
    const { isBookmarked, notes } = req.body

    if (!mongoose.isValidObjectId(subSectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      })
    }

    if (
      isBookmarked === undefined &&
      notes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a bookmark state or notes to save",
      })
    }

    if (
      isBookmarked !== undefined &&
      typeof isBookmarked !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Bookmark state must be true or false",
      })
    }

    if (notes !== undefined && typeof notes !== "string") {
      return res.status(400).json({
        success: false,
        message: "Notes must be text",
      })
    }

    if (notes !== undefined && notes.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Notes cannot exceed 5000 characters",
      })
    }

    const lesson = await SubSection.findById(subSectionId)

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      })
    }

    const updates = {}

    if (isBookmarked !== undefined) {
      updates.isBookmarked = isBookmarked
    }

    if (notes !== undefined) {
      updates.notes = notes.trim()
    }

    const record = await LessonBookmark.findOneAndUpdate(
      {
        userId: req.user.id,
        subSectionId,
      },
      {
        $set: updates,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    return res.status(200).json({
      success: true,
      message: "Bookmark and notes saved successfully",
      data: record,
    })
  } catch (error) {
    console.error("Save lesson bookmark failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not save bookmark or notes",
    })
  }
}
