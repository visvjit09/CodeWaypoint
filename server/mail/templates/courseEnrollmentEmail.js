exports.courseEnrollmentEmail = (courseName, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeWaypoint - Course Enrollment</title>
  <style>
    body {
      background-color: #f4f7fb;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #263247;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 560px;
      margin: 30px auto;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 12px;
      text-align: center;
    }
    .brand {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 24px;
    }
    .message {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .highlight {
      font-weight: bold;
      color: #2563eb;
    }
    .cta {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 16px;
    }
    .support {
      font-size: 13px;
      color: #64748b;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">CodeWaypoint</div>
    <div class="message">Course Enrollment Confirmed!</div>
    <div class="body">
      <p>Dear ${name},</p>
      <p>You have successfully enrolled in <span class="highlight">"${courseName}"</span>.</p>
      <p>We're excited to be part of your learning journey. Open your dashboard to access your course materials and continue learning.</p>
      <a class="cta" href="${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/enrolled-courses">
        Go to My Courses
      </a>
      <p>Learn. Practice. Track. Improve.</p>
    </div>
    <div class="support">
      If you need assistance, please contact us through the CodeWaypoint platform.
      <p>&copy; ${new Date().getFullYear()} CodeWaypoint. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};