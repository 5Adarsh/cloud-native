import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${user.id}/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? <p>Cart is empty.</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item._id}>
                <td>{item.productId}</td>
                <td>{item.quantity}</td>
                <td><button onClick={() => removeFromCart(item.productId)} className="btn btn-danger btn-sm">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cartItems.length > 0 && (
        <button onClick={() => navigate('/checkout')} className="btn btn-primary">Proceed to Checkout</button>
      )}
    </div>
  );
}

export default Cart;
