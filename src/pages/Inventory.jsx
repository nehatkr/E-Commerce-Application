import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/inventorySlice';

const Inventory = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    id: '', name: '', category: 'Men', sizes: [], quantity: '',
    originalPrice: '', discount: '', discountedPrice: '',
    description: '', image: null
  });
  const [preview, setPreview] = useState(null);

  // Auto calculate discounted price
  useEffect(() => {
    if (form.originalPrice && form.discount) {
      const price = parseFloat(form.originalPrice);
      const disc = parseFloat(form.discount);
      const final = price - (price * (disc / 100));
      setForm(prev => ({ ...prev, discountedPrice: final.toFixed(2) }));
    }
  }, [form.originalPrice, form.discount]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, image: URL.createObjectURL(file) }); // In real app, upload to server
    }
  };

  const handleSizeChange = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setForm({ ...form, sizes: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!form.name || !form.originalPrice) return alert("Fill required fields");
    
    dispatch(addProduct({ ...form, id: Date.now().toString() }));
    alert('Product Added Successfully');
    setForm({
        id: '', name: '', category: 'Men', sizes: [], quantity: '',
        originalPrice: '', discount: '', discountedPrice: '',
        description: '', image: null
    });
    setPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 mt-16 ">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Inventory Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg space-y-6 border-gray-900">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className="input-field" placeholder="Product ID" value={form.id} onChange={e => setForm({...form, id: e.target.value})} />
          <input className="input-field" placeholder="Product Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
            </select>
            <input type="number" className="input-field" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (Hold Ctrl to select multiple)</label>
            <select multiple className="input-field h-24" onChange={handleSizeChange}>
                {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
            <input type="number" className="input-field" placeholder="Price ($)" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} required />
            <input type="number" className="input-field" placeholder="Discount %" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
            <input className="input-field bg-gray-100" placeholder="Final Price" value={form.discountedPrice} readOnly />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {preview && <img src={preview} alt="Preview" className="mt-4 h-32 w-32 object-cover rounded-md border" />}
        </div>

        <textarea className="input-field" rows="3" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>

        <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 font-bold">Add Product</button>
      </form>
    </div>
  );
};

export default Inventory;