import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import api from '../../api/axios';
import { useAlert } from '../../context/AlertContext';

export default function ManageBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showConfirm, showAlert } = useAlert();

  const fetchBuyers = async () => {
    try {
      const response = await api.get('/users/role/BUYER');
      setBuyers(response.data);
    } catch (error) {
      showAlert("Error", "Failed to fetch buyers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuyers(); }, []);

  const handleAction = (id, name, action, confirmMsg) => {
    showConfirm("Confirm Action", confirmMsg, async () => {
      try {
        await api.put(`/users/${id}/action?type=${action}`);
        showAlert("Success", `${name} has been successfully updated.`);
        fetchBuyers();
      } catch (error) {
        showAlert("Error", "Action failed. Please try again.");
      }
    });
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Status", render: (buyer) => (
        <div className="flex gap-2 flex-wrap">
          {buyer.approvalStatus === 'REJECTED' ? (
             <Badge type="danger">Banned</Badge> 
          ) : (
             buyer.isActive ? <Badge type="success">Active</Badge> : <Badge type="neutral">Deactivated</Badge>
          )}
        </div>
    )},
    { header: "Actions", render: (buyer) => (
        <div className="flex gap-2 justify-end flex-wrap">
          
          {/* Active අයට Deactivate කරන්න දෙනවා */}
          {buyer.approvalStatus !== 'REJECTED' && buyer.isActive && (
            <Button variant="outline" className="py-1 px-3 text-xs text-orange-500 border-orange-200 hover:bg-orange-50" onClick={() => handleAction(buyer.id, buyer.name, 'DEACTIVATE', `Temporarily deactivate ${buyer.name}? They won't be able to log in.`)}>
              Deactivate
            </Button>
          )}
          
          {/* Deactivated අයට ආයෙත් Activate වෙන්න දෙනවා */}
          {buyer.approvalStatus !== 'REJECTED' && !buyer.isActive && (
            <Button variant="success" className="py-1 px-3 text-xs bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAction(buyer.id, buyer.name, 'ACTIVATE', `Re-activate ${buyer.name}?`)}>
              Activate
            </Button>
          )}
          
          {/* Ban කරනවා (Reject status එකට දානවා) */}
          {buyer.approvalStatus !== 'REJECTED' && (
             <Button variant="danger" className="py-1 px-3 text-xs bg-red-100 text-red-600 hover:bg-red-200" onClick={() => handleAction(buyer.id, buyer.name, 'REJECT', `Ban ${buyer.name}? They will be completely restricted.`)}>
               Ban User
             </Button>
          )}

          {/* Banned අයව ආයෙත් Approve කරලා ඇතුළට ගන්නවා */}
          {buyer.approvalStatus === 'REJECTED' && (
             <Button variant="primary" className="py-1 px-3 text-xs" onClick={() => handleAction(buyer.id, buyer.name, 'APPROVE', `Remove ban for ${buyer.name}?`)}>
               Unban
             </Button>
          )}

        </div>
    )}
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = buyers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(buyers.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Buyers</h1>
        <p className="text-gray-500">View and manage customer accounts.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <p className="p-8 text-center text-gray-500">Loading buyers...</p> : (
          <>
            <Table columns={columns} data={currentItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}