exports.passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeWaypoint - Password Updated</title>
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
      overflow-wrap: anywhere;
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
    <div class="message">Password Updated Successfully</div>
    <div class="body">
      <p>Hi ${name},</p>
      <p>Your password has been successfully updated for the account associated with <span class="highlight">${email}</span>.</p>
      <p>If you did not make this change, please reset your password immediately and contact the support team through CodeWaypoint.</p>
      <p>Keep learning securely!</p>
      <p>Learn. Practice. Track. Improve.</p>
    </div>
    <div class="support">
      This is an automated security notification.
      <p>&copy; ${new Date().getFullYear()} CodeWaypoint. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};