import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import CustomerDetailsModal from './CustomerDetailsModal'; // NEW IMPORT

export default function CustomerTable({ refreshTrigger, onEditCustomer }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // NEW: State to track which customer to show in the modal
    const [viewingCustomer, setViewingCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, [refreshTrigger]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(''); 
            setCustomers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load customers.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer? This cannot be undone.")) {
            try {
                await apiClient.delete(`/${id}`);
                fetchCustomers();
            } catch (err) {
                alert("Failed to delete customer.");
            }
        }
    };

    if (loading) return <div className="text-gray-400 p-4">Loading customers...</div>;
    if (error) return <div className="text-red-400 p-4">{error}</div>;

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden w-full max-w-5xl mt-8">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Customer Directory</h2>
                <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    {customers.length} Records
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-4">ID</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Date of Birth</th>
                            <th scope="col" className="px-6 py-4">NIC</th>
                            <th scope="col" className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No customers found. Upload an Excel file or create one manually.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{customer.id}</td>
                                    <td className="px-6 py-4 text-white">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.dob}</td>
                                    <td className="px-6 py-4">{customer.nic}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        
                                        {/* NEW VIEW BUTTON */}
                                        <button 
                                            onClick={() => setViewingCustomer(customer)}
                                            className="font-medium text-emerald-400 hover:text-emerald-300"
                                        >
                                            View
                                        </button>

                                        <button 
                                            onClick={() => onEditCustomer(customer)}
                                            className="font-medium text-amber-400 hover:text-amber-300"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(customer.id)}
                                            className="font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* NEW MODAL RENDER */}
            {viewingCustomer && (
                <CustomerDetailsModal 
                    customer={viewingCustomer} 
                    onClose={() => setViewingCustomer(null)} 
                />
            )}
        </div>
    );
}