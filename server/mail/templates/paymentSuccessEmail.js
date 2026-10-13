exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeWaypoint - Payment Confirmation</title>
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
    .details {
      background-color: #eef2ff;
      padding: 16px;
      border-radius: 8px;
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
    <div class="message">Payment Confirmation</div>
    <div class="body">
      <p>Dear ${name},</p>
      <p>Thank you for choosing CodeWaypoint. We have received your payment successfully.</p>
      <div class="details">
        <p>Amount Paid: <span class="highlight">₹${amount}</span></p>
        <p>Payment ID: <b>${paymentId}</b></p>
        <p>Order ID: <b>${orderId}</b></p>
      </div>
      <p>You can now continue your learning journey with CodeWaypoint.</p>
      <p>Learn. Practice. Track. Improve.</p>
    </div>
    <div class="support">
      If you need assistance, please contact us through the CodeWaypoint platform.
      <p>&copy; ${new Date().getFullYear()} CodeWaypoint</p>
    </div>
  </div>
</body>
</html>`;
};