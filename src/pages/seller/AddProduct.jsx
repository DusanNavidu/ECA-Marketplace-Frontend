import React, { useState, useEffect } from 'react';
import SellerLayout from '../../layouts/SellerLayout';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import api from '../../api/axios';
import { useAlert } from '../../context/AlertContext';
import { jwtDecode } from 'jwt-decode';

export default function AddProduct() {
  const [formData, setFormData] = useState({ title: '', description: '', price: '' });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [sellerId, setSellerId] = useState(null);
  const [sellerEmail, setSellerEmail] = useState('');
  
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setSellerEmail(decoded.sub); 
          
          const response = await api.get(`/users/${decoded.sub}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data && response.data.id) {
            setSellerId(response.data.id);
          } else {
            setError("Error: Seller ID missing from backend. Did you update UserController?");
          }
        }
      } catch (err) {
        setError("Failed to load seller information. Please refresh.");
      }
    };
    fetchSellerData();
  }, []);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (images.length + selectedFiles.length > 3) {
      setError("You can only upload a maximum of 3 images total.");
      return;
    }
    
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);
    setError('');

    const previews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    setImagePreviews(newImages.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sellerId) {
      setError("Seller ID is not ready yet. Please wait...");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least 1 image for the product.");
      return;
    }
    
    setLoading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('sellerId', sellerId);
    submitData.append('sellerEmail', sellerEmail);
    
    images.forEach((image) => {
      submitData.append('images', image);
    });

    try {
      const token = localStorage.getItem('token');
      await api.post('/catalog/add', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      showAlert('Success!', 'Product added successfully! 🎉');
      
      setFormData({ title: '', description: '', price: '' });
      setImages([]);
      setImagePreviews([]);
      
    } catch (err) {
      setError('Failed to add product. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">List a new item in the marketplace catalog.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <ErrorMessage message={error} className="mb-6" />
        
        {!sellerId && !error && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
            ⏳ Connecting to your seller profile... Please wait a second before publishing.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Product Title</Label>
              <Input 
                id="title" placeholder="e.g. Dell XPS 15 Laptop" required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" rows="4" required placeholder="Describe your product..."
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input 
                    id="price" type="number" step="0.01" placeholder="0.00" required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                />
            </div>

            <div>
              <Label htmlFor="images">Upload Images (Max 3)</Label>
              <input 
                id="images" type="file" multiple accept="image/*" disabled={images.length >= 3}
                className="w-full p-2 border border-gray-300 rounded text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 disabled:opacity-50"
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-400 mt-1">{images.length}/3 images selected</p>
            </div>
          </div>

          {/* අලුත් Image Previews එක (Remove කරන්න පුළුවන් විදිහට) */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img src={src} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full py-3 text-lg" disabled={loading || !sellerId}>
            {loading ? 'Publishing Product...' : 'Publish Product'}
          </Button>
        </form>
      </div>
    </SellerLayout>
  );
}