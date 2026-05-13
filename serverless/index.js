const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

// Mock Firebase Admin init
// admin.initializeApp();

// Actual Firebase Cloud Function
exports.paymentWebhook = functions.https.onRequest((req, res) => {
  const { userId, orderId, amount } = req.body;
  console.log(`[SERVERLESS] Processing Payment Webhook - Order: ${orderId}, User: ${userId}, Amount: ${amount}`);
  // In a real scenario, we'd send an email via SendGrid/AWS SES or update a DB
  console.log(`[SERVERLESS] Email confirmation sent to User ${userId} for Order ${orderId}`);
  res.status(200).send({ message: 'Webhook processed and email sent successfully.' });
});

// Local wrapper for Docker Compose testing
if (require.main === module) {
  const app = express();
  app.use(express.json());
  app.post('/ecommerce/us-central1/paymentWebhook', (req, res) => {
    exports.paymentWebhook(req, res);
  });
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Local Serverless mock listening on port ${PORT}`));
}
