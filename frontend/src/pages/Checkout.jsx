import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleCheckout = async () => {
    try {
      setStatus('Processing payment...');
      
      // Get cart to calculate total (simulated total 100)
      const total = 100;
      
      // Process payment
      const paymentRes = await axios.post('http://localhost:8080/api/payments/process', {
        userId: user.id,
        orderId: `ORD-${Date.now()}`,
        amount: total
      });

      if (paymentRes.data.success) {
        // Place order
        await axios.post('http://localhost:8080/api/orders', {
          userId: user.id,
          items: [], // usually passed from cart
          total
        });
        
        // Clear cart
        await axios.delete(`http://localhost:8080/api/cart/${user.id}`);
        
        setStatus('Payment successful! Order placed.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('Payment failed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred during checkout.');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Simulating checkout for your cart...</p>
      <button onClick={handleCheckout} className="btn btn-success">Pay Now</button>
      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
}

export default Checkout;
