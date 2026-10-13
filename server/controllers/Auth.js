
const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

// Disable the legacy endpoint that exposed every user record.
exports.users = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "User listing is disabled",
  })
}

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    if (!["Student", "Instructor"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    const otpRecords = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1)

    if (
      otpRecords.length === 0 ||
      String(otp) !== String(otpRecords[0].otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Preserve the current account-approval behavior.
    const approved = true

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: "",
    })

    const safeUser = user.toObject()
    delete safeUser.password
    delete safeUser.token

    return res.status(201).json({
      success: true,
      user: safeUser,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Signup failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      })
    }

    const user = await User.findOne({ email }).populate("additionalDetails")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up to continue.",
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured")
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    )

    const safeUser = user.toObject()
    delete safeUser.password
    delete safeUser.token

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: safeUser,
      message: "User login successful",
    })
  } catch (error) {
    console.error("Login failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    })
  }
}

// Send OTP for Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      })
    }

    const otpOptions = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    }

    let otp
    let existingOtp

    do {
      otp = otpGenerator.generate(6, otpOptions)
      existingOtp = await OTP.findOne({ otp })
    } while (existingOtp)

    await OTP.create({ email, otp })

    // The OTP model handles its existing email-delivery behavior.
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("OTP request failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not send OTP. Please try again.",
    })
  }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      })
    }

    const passwordMatches = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      })
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    if (!updatedUserDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    try {
      await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
    } catch (emailError) {
      console.error(
        "Password update email failed:",
        emailError.message
      )

      return res.status(500).json({
        success: false,
        message: "Password updated, but the notification email could not be sent.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Password update failed:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not update password. Please try again.",
    })
  }
}