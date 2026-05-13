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
    .then(() => console.log('Cart DB Connected'))
    .catch(err => console.log(err));
};
connectDB();

const cartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

app.get('/:userId', async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let item = await CartItem.findOne({ userId, productId });
    if (item) {
      item.quantity += quantity || 1;
    } else {
      item = new CartItem({ userId, productId, quantity: quantity || 1 });
    }
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/:userId/:productId', async (req, res) => {
  try {
    await CartItem.deleteOne({ userId: req.params.userId, productId: req.params.productId });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/:userId', async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));
