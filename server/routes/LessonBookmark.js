
const express = require("express")
const router = express.Router()

const { auth } = require("../middleware/auth")

const {
  getMyLessonBookmarks,
  getLessonBookmark,
  saveLessonBookmark,
} = require("../controllers/LessonBookmark")

// Get all bookmarks and notes for the logged-in user
router.get("/", auth, getMyLessonBookmarks)

// Get the saved bookmark and notes for a particular lesson
router.get("/:subSectionId", auth, getLessonBookmark)

// Create or update a bookmark and personal notes
router.put("/:subSectionId", auth, saveLessonBookmark)

module.exports = router
