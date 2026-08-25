import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import api from '../../api/axios';
import { useAlert } from '../../context/AlertContext';

export default function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showConfirm, showAlert } = useAlert();

  const fetchSellers = async () => {
    try {
      const response = await api.get('/users/role/SELLER');
      setSellers(response.data);
    } catch (error) {
      showAlert("Error", "Failed to fetch sellers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleAction = (id, name, action, confirmMsg) => {
    showConfirm("Confirm Action", confirmMsg, async () => {
      try {
        await api.put(`/users/${id}/action?type=${action}`);
        showAlert("Success", `${name} has been successfully updated. 🎉`);
        fetchSellers();
      } catch (error) {
        showAlert("Error", "Action failed. Please try again. 🛑");
      }
    });
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Status", render: (seller) => (
        <div className="flex gap-2 flex-wrap">
          {seller.approvalStatus === 'PENDING' && <Badge type="warning">Pending</Badge>}
          {seller.approvalStatus === 'APPROVED' && <Badge type="success">Approved</Badge>}
          {seller.approvalStatus === 'REJECTED' && <Badge type="danger">Rejected</Badge>}
          
          {!seller.isActive && <Badge type="neutral">Deactivated</Badge>}
        </div>
    )},
    { header: "Actions", render: (seller) => (
        <div className="flex gap-2 justify-end flex-wrap">
          
          {(seller.approvalStatus === 'PENDING' || seller.approvalStatus === 'REJECTED') && (
            <Button variant="primary" className="py-1 px-3 text-xs" onClick={() => handleAction(seller.id, seller.name, 'APPROVE', `Approve ${seller.name}? They will be able to log in and sell items.`)}>
              Approve
            </Button>
          )}
          
          {(seller.approvalStatus === 'PENDING' || seller.approvalStatus === 'APPROVED') && (
            <Button variant="danger" className="py-1 px-3 text-xs bg-red-100 text-red-600 hover:bg-red-200" onClick={() => handleAction(seller.id, seller.name, 'REJECT', `Reject ${seller.name}? They will lose access to their seller account.`)}>
              Reject
            </Button>
          )}

          {seller.approvalStatus === 'APPROVED' && seller.isActive && (
            <Button variant="outline" className="py-1 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-100" onClick={() => handleAction(seller.id, seller.name, 'DEACTIVATE', `Temporarily deactivate ${seller.name}?`)}>
              Deactivate
            </Button>
          )}
          
          {seller.approvalStatus === 'APPROVED' && !seller.isActive && (
            <Button variant="success" className="py-1 px-3 text-xs bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAction(seller.id, seller.name, 'ACTIVATE', `Re-activate ${seller.name}?`)}>
              Activate
            </Button>
          )}

        </div>
    )}
  ];

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sellers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sellers.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Sellers</h1>
        <p className="text-gray-500">Approve, reject, or temporarily deactivate seller accounts.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <p className="p-8 text-center text-gray-500">Loading sellers...</p> : (
          <>
            <Table columns={columns} data={currentItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}