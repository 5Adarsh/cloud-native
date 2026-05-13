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
    .then(() => {
      console.log('Product DB Connected');
      seedProducts();
    })
    .catch(err => console.log(err));
};
connectDB();

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String
});

const Product = mongoose.model('Product', productSchema);

// Seed Data
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count < 8) {
    await Product.deleteMany({}); // clear existing
    await Product.insertMany([
      { name: 'Cloud Native T-Shirt', description: 'Premium cotton t-shirt with Cloud Native logo. Perfect for conferences and everyday coding.', price: 25, category: 'Apparel', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
      { name: 'K8s Coffee Mug', description: 'Ceramic coffee mug featuring the Kubernetes logo. Keeps your coffee warm while your pods crash.', price: 15, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
      { name: 'Docker Developer Hoodie', description: 'Comfortable dark mode hoodie for long debugging sessions.', price: 45, category: 'Apparel', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' },
      { name: 'React Sticker Pack', description: 'Decorate your laptop with these high-quality vinyl React and Vite stickers.', price: 10, category: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500&q=80' },
      { name: 'Serverless Architecture Handbook', description: 'The complete guide to building scalable backend systems without managing infrastructure.', price: 35, category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' },
      { name: 'Mechanical Keyboard PRO', description: 'Tactile mechanical keyboard with customizable RGB backlighting for maximum typing speed.', price: 120, category: 'Hardware', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
      { name: 'Ergonomic Developer Mouse', description: 'Wireless ergonomic mouse designed to reduce wrist strain during long coding hours.', price: 60, category: 'Hardware', imageUrl: 'https://images.unsplash.com/photo-1527814050087-379381547994?w=500&q=80' },
      { name: 'Noise Cancelling Headphones', description: 'Block out the open office noise and get into the flow state with premium active noise cancellation.', price: 250, category: 'Hardware', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' }
    ]);
    console.log('Seeded Products successfully with richer data');
  }
};

app.get('/', async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i');
  if (category) filter.category = category;
  
  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
