import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products?search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <input 
        type="text" 
        className="form-control mb-4" 
        placeholder="Search products..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
      />
      <div className="row">
        {products.map(p => (
          <div key={p._id} className="col-md-4 mb-4">
            <div className="card">
              <img src={p.imageUrl} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">${p.price}</p>
                <Link to={`/product/${p._id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
