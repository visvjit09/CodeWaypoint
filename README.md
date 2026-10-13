# CodeWaypoint – Coding Learning & Progress Tracker

CodeWaypoint is a full-stack learning platform designed to help students learn through structured courses, track their coding practice, and monitor their learning progress in one place.

The platform combines video-based learning, instructor-led course management, a personal Data Structures and Algorithms (DSA) practice tracker, and learning analytics to help learners organize their preparation and stay consistent.

## 🚀 Features

### 👨‍🎓 Learning & Courses
- User registration, login, email verification, and password reset.
- Browse courses and view detailed course information.
- Video-based lessons with lecture navigation.
- Course enrollment and learning progress tracking.
- Bookmark lessons for quick access.
- Add and save personal notes for individual lessons.
- Course reviews and ratings.

### 💻 DSA Practice Tracker
- Maintain a personal record of Data Structures and Algorithms problems.
- Track problem status: Todo, In Progress, and Solved.
- Organize problems by platform, topic, and difficulty.
- Add personal notes to coding problems.
- Search and filter problems to find specific entries.
- Store problem records persistently in MongoDB.
- Manage and track coding problems independently for each user.

### 📊 Learning Analytics
- View total, solved, in-progress, and pending DSA problems.
- Calculate the problem completion rate.
- Analyze practice distribution by difficulty and topic.
- Generate statistics from saved DSA practice records.

### 👨‍🏫 Instructor Dashboard
- Create and manage courses.
- Add course sections and lectures.
- Upload course media using Cloudinary.
- Publish courses for learners.

### 🔐 Authentication & Media
- JWT-based authentication.
- Email verification and password-reset workflows.
- Email notifications using Nodemailer.
- Cloudinary integration for media uploads.

### 🎨 User Interface
- Responsive React-based interface.
- Tailwind CSS styling.
- Dedicated learner and instructor workflows.

## 🛠️ Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Chart.js
- Swiper.js
- Additional UI libraries

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Nodemailer
- Cloudinary

## ⚙️ Getting Started

### Prerequisites
Ensure the following are installed:
- Node.js and npm
- MongoDB (local instance or cloud database)
- Git (if cloning from a repository)

## 📦 Installation

### 1. Clone the Repository

Replace the placeholders with your actual repository URL and project folder name.

```bash
git clone <your-repository-url>
cd CodeWaypoint
```

### 2. Install Frontend Dependencies

Run this command from the project root:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory using `server/.env.example` as a reference.

Configure the variables required by your local setup:

```env
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

MAIL_HOST=your_smtp_host
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password
```

Use the exact variable names expected by your backend configuration. Never commit real credentials, API secrets, email app passwords, or other sensitive values.

### Frontend API Configuration

The frontend uses `REACT_APP_BASE_URL` to configure the backend address. If it is not set, the application defaults to:

```env
REACT_APP_BASE_URL=http://localhost:4000
```

## ▶️ Running the Application

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal from the project root:

```bash
npm start
```

Ensure MongoDB is running and the environment variables are configured before using the application.

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000
- **Backend Health Check:** http://localhost:4000/healthz

These are the default local development addresses.

## 💳 Payment Status

Payment processing is currently disabled. Razorpay is not available as a functional payment feature in this version.

## 🔒 Security Notes

- Keep environment files and credentials private.
- Use strong JWT secrets and appropriate production environment settings.
- Configure CORS, authentication, and authorization correctly before deployment.
- Verify payment orders and payment signatures securely before enabling payment processing.

## 📌 Project Summary

CodeWaypoint brings structured course learning, DSA problem tracking, and personal learning analytics together in a single platform, helping learners organize their study workflow and monitor their progress.