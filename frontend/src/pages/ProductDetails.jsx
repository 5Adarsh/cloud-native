import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return navigate('/login');
      
      await axios.post('http://localhost:8080/api/cart', {
        userId: user.id,
        productId: product._id,
        quantity: 1
      });
      alert('Added to cart');
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={product.imageUrl} className="img-fluid" alt={product.name} />
      </div>
      <div className="col-md-6">
        <h2>{product.name}</h2>
        <p className="text-muted">{product.category}</p>
        <h4>${product.price}</h4>
        <p>{product.description}</p>
        <button onClick={addToCart} className="btn btn-success">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetails;
