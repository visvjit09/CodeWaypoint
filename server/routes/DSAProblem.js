
const express = require("express")
const router = express.Router()

const { auth } = require("../middleware/auth")

const {
  createProblem,
  getProblems,
  updateProblem,
  deleteProblem,
} = require("../controllers/DSAProblem")

// Get all problems belonging to the logged-in user
router.get("/", auth, getProblems)

// Add a new DSA problem
router.post("/", auth, createProblem)

// Update an existing problem
router.patch("/:id", auth, updateProblem)

// Delete a problem
router.delete("/:id", auth, deleteProblem)

module.exports = router
