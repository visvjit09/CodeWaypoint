
const DSAProblem = require("../models/DSAProblem")

// Create a DSA problem
exports.createProblem = async (req, res) => {
  try {
    const { title, problemUrl, platform, topic, difficulty, status, notes } =
      req.body

    if (!title?.trim() || !problemUrl?.trim() || !topic?.trim() || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Title, problem URL, topic, and difficulty are required",
      })
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty",
      })
    }

    if (
      status !== undefined &&
      !["Todo", "In Progress", "Solved"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem status",
      })
    }

    let parsedUrl
    try {
      parsedUrl = new URL(problemUrl.trim())
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid problem URL",
      })
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Problem URL must start with HTTP or HTTPS",
      })
    }

    const allowedPlatforms = [
      "LeetCode",
      "GeeksforGeeks",
      "Codeforces",
      "Other",
    ]

    const selectedPlatform = platform || "LeetCode"

    if (!allowedPlatforms.includes(selectedPlatform)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem platform",
      })
    }

    const problem = await DSAProblem.create({
      userId: req.user.id,
      title: title.trim(),
      problemUrl: parsedUrl.toString(),
      platform: selectedPlatform,
      topic: topic.trim(),
      difficulty,
      status: status || "Todo",
      notes: notes || "",
      solvedAt: status === "Solved" ? new Date() : null,
    })

    return res.status(201).json({
      success: true,
      message: "Problem added successfully",
      data: problem,
    })
  } catch (error) {
    console.error("Create DSA problem failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not add the problem",
    })
  }
}

// Get the logged-in user's problems
exports.getProblems = async (req, res) => {
  try {
    const problems = await DSAProblem.find({ userId: req.user.id }).sort({
      createdAt: -1,
    })

    return res.status(200).json({
      success: true,
      data: problems,
    })
  } catch (error) {
    console.error("Get DSA problems failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not retrieve problems",
    })
  }
}

// Update a problem owned by the logged-in user
exports.updateProblem = async (req, res) => {
  try {
    const { title, problemUrl, platform, topic, difficulty, status, notes } =
      req.body

    const updates = {}

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        })
      }
      updates.title = title.trim()
    }

    if (problemUrl !== undefined) {
      try {
        const parsedUrl = new URL(problemUrl.trim())

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol")
        }

        updates.problemUrl = parsedUrl.toString()
      } catch {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid problem URL",
        })
      }
    }

    if (topic !== undefined) {
      if (!topic.trim()) {
        return res.status(400).json({
          success: false,
          message: "Topic cannot be empty",
        })
      }
      updates.topic = topic.trim()
    }

    if (difficulty !== undefined) {
      if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Invalid difficulty",
        })
      }
      updates.difficulty = difficulty
    }

    if (status !== undefined) {
      if (!["Todo", "In Progress", "Solved"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid problem status",
        })
      }

      updates.status = status
      updates.solvedAt =
        status === "Solved" ? new Date() : null
    }

    if (platform !== undefined) {
      if (
        !["LeetCode", "GeeksforGeeks", "Codeforces", "Other"].includes(
          platform
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid problem platform",
        })
      }
      updates.platform = platform
    }

    if (notes !== undefined) {
      updates.notes = notes
    }

    const problem = await DSAProblem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      })
    }

    console.error("Update DSA problem failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not update the problem",
    })
  }
}

// Delete a problem owned by the logged-in user
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await DSAProblem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      })
    }

    console.error("Delete DSA problem failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not delete the problem",
    })
  }
}