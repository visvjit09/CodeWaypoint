// Load environment variables before importing modules that read them.
require("dotenv").config();
// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
// Payment routes intentionally remain disabled until payment verification is hardened.
// const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dsaRoutes = require("./routes/DSAProblem");
const lessonBookmarkRoutes = require("./routes/LessonBookmark");
// Setting up port number
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

// Connecting to database
database.connect();
 

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin(origin, callback) {
			// Permit non-browser requests (such as health checks) without an Origin header.
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error("Origin is not allowed by CORS"));
		},
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/dsa", dsaRoutes);
app.use("/api/v1/lesson-bookmarks", lessonBookmarkRoutes);
// Payment endpoints stay disabled until order/course binding and verification are hardened.
// app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Health check for local and hosted environments.
app.get("/healthz", (req, res) => {
	return res.status(200).json({ success: true, status: "ok" });
});

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
