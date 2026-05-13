const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/process', async (req, res) => {
  const { userId, orderId, amount } = req.body;
  
  // Simulate payment delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 90% success rate
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    try {
      // Trigger Serverless Function for Email/Confirmation
      const serverlessUrl = process.env.SERVERLESS_URL || 'http://localhost:5001/ecommerce/us-central1/paymentWebhook';
      axios.post(serverlessUrl, { userId, orderId, amount }).catch(e => console.error('Serverless call failed:', e.message));
      
      res.json({ success: true, transactionId: `TXN-${Math.floor(Math.random() * 1000000)}` });
    } catch (error) {
      res.json({ success: true, warning: 'Payment succeeded but webhook failed' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Insufficient funds or card declined' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
