require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  let MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    MONGO_URI = mongoServer.getUri();
    console.log(`Using Local In-Memory MongoDB: ${MONGO_URI}`);
  }

  mongoose.connect(MONGO_URI)
    .then(() => console.log('Order DB Connected'))
    .catch(err => console.log(err));
};
connectDB();

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{ productId: String, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.post('/', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    const order = new Order({ userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
