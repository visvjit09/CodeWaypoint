
require("dotenv").config()

const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000"

// Send password reset email
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const user = await User.findOne({ email })

    // Use the same response whether the email exists or not.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered, a password reset email will be sent.",
      })
    }

    const token = crypto.randomBytes(32).toString("hex")

    await User.findByIdAndUpdate(user._id, {
      token,
      resetPasswordExpires: Date.now() + 3600000,
    })

    const url = `${FRONTEND_URL}/update-password/${token}`

    await mailSender(
      email,
      "CodeWaypoint Password Reset",
      `Click the following link to reset your password: ${url}. This link expires in one hour. If you did not request this, you can ignore this email.`
    )

    return res.status(200).json({
      success: true,
      message:
        "If the email is registered, a password reset email will be sent.",
    })
  } catch (error) {
    console.error("Password reset email failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not send the password reset email. Please try again.",
    })
  }
}

// Reset password using the emailed token
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "Password, confirmation, and token are required",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      })
    }

    const userDetails = await User.findOne({ token })

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has already been used",
      })
    }

    if (
      !userDetails.resetPasswordExpires ||
      userDetails.resetPasswordExpires <= Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
      })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userDetails._id,
        token,
      },
      {
        $set: {
          password: encryptedPassword,
        },
        $unset: {
          token: "",
          resetPasswordExpires: "",
        },
      },
      {
        new: true,
      }
    )

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has already been used",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Password reset failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not reset the password. Please try again.",
    })
  }
}