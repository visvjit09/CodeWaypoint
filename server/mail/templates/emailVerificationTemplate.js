const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeWaypoint - OTP Verification</title>
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
    .otp {
      display: inline-block;
      padding: 12px 24px;
      background-color: #eef2ff;
      color: #4338ca;
      border-radius: 8px;
      font-size: 30px;
      letter-spacing: 6px;
      font-weight: bold;
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
    <div class="message">Verify your email</div>
    <div class="body">
      <p>Hi there,</p>
      <p>Thanks for signing up for CodeWaypoint — your coding learning and progress tracker.</p>
      <p>Use the following one-time password (OTP) to verify your email address:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 5 minutes. If you did not request this verification, you can safely ignore this email.</p>
      <p>Learn. Practice. Track. Improve.</p>
    </div>
    <div class="support">
      Need help? Please contact the support team through the CodeWaypoint platform.
      <p>&copy; ${new Date().getFullYear()} CodeWaypoint</p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = otpTemplate;