exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);

  const fullName = `${escapeHtml(firstname)} ${escapeHtml(lastname)}`;
  const safeEmail = escapeHtml(email);
  const safePhone = `${escapeHtml(countrycode)} ${escapeHtml(phoneNo)}`;
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeWaypoint - Contact Confirmation</title>
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
    .details {
      background-color: #eef2ff;
      padding: 16px;
      border-radius: 8px;
      text-align: left;
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
    <div class="message">We Received Your Message!</div>
    <div class="body">
      <p>Dear ${fullName},</p>
      <p>Thank you for contacting CodeWaypoint. Your message has been received, and we will respond as soon as possible.</p>
      <p>Here is a copy of the information you submitted:</p>
      <div class="details">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong><br>${safeMessage}</p>
      </div>
      <p>We appreciate your interest in CodeWaypoint.</p>
      <p>Learn. Practice. Track. Improve.</p>
    </div>
    <div class="support">
      This is an automated confirmation of your contact request.
      <p>&copy; ${new Date().getFullYear()} CodeWaypoint. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};