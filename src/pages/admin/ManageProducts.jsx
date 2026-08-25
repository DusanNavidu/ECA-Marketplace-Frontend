import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAlert } from '../../context/AlertContext';
import AdminLayout from '../../layouts/AdminLayout';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/ui/Button';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { showAlert, showConfirm } = useAlert(); // 👈 showConfirm එකත් ගත්තා

  const fetchProducts = async () => {
    try {
      const response = await api.get('/catalog/all');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      showAlert('Error', 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search Filter එක (Title එකෙන් හරි Category එකෙන් හරි හොයන්න පුළුවන්)
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Delete Function එක (showConfirm පාවිච්චි කරලා)
  const handleDelete = (id, title) => {
    showConfirm("Delete Product", `Are you sure you want to delete "${title}"?`, async () => {
      try {
        await api.delete(`/catalog/delete/${id}`);
        showAlert('Deleted! 🗑️', `Product "${title}" has been removed.`);
        fetchProducts(); 
        
        // අන්තිම පිටුවේ එකම Item එක මැකුවොත් කලින් පිටුවට යන්න
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Failed to delete product", error);
        showAlert('Error 🛑', 'Could not delete the product.');
      }
    });
  };

  // Table එකට අදාළ Columns ටික
  const columns = [
    { 
      header: "Image", 
      render: (product) => {
        const imageUrl = product.imageUrls && product.imageUrls.length > 0 
          ? `http://localhost:8080/images/${product.imageUrls[0]}` 
          : 'https://placehold.co/50x50?text=No+Image';
        return (
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="w-12 h-12 rounded-lg object-cover bg-gray-200 border border-gray-200" 
          />
        );
      }
    },
    { 
      header: "Title & Description", 
      render: (product) => (
        <div>
          <div className="font-bold text-gray-800">{product.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
        </div>
      )
    },
    { 
      header: "Price", 
      render: (product) => (
        <span className="font-black text-primary">$ {product.price.toLocaleString()}</span>
      )
    },
    { 
      header: "Category", 
      render: (product) => (
        <span className="text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded-md text-xs">
          {product.category}
        </span>
      )
    },
    { 
      header: "Action", 
      render: (product) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="danger" 
            className="py-1 px-3 text-xs bg-red-100 text-red-600 hover:bg-red-200" 
            onClick={() => handleDelete(product.id, product.title)}
          >
            Delete 🗑️
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Catalog Items 🏷️</h1>
          <p className="text-gray-500">View, search, and remove products from the marketplace.</p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500 font-bold">Loading Catalog...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No products found matching your search.</p>
        ) : (
          <>
            <Table columns={columns} data={currentItems} />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}