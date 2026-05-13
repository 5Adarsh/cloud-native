const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

const services = {
    '/api/users': process.env.USER_SERVICE_URL || 'http://localhost:3001',
    '/api/products': process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    '/api/cart': process.env.CART_SERVICE_URL || 'http://localhost:3003',
    '/api/orders': process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    '/api/payments': process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
};

// Setup proxies
for (const [route, target] of Object.entries(services)) {
    app.use(route, createProxyMiddleware({ 
        target, 
        changeOrigin: true,
        pathRewrite: { [`^${route}`]: '' }
    }));
}

app.get('/health', (req, res) => res.send('API Gateway is running'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
