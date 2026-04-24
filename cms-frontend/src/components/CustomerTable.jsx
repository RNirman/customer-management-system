import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import CustomerDetailsModal from './CustomerDetailsModal';

export default function CustomerTable({ refreshTrigger, onEditCustomer }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, [refreshTrigger]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(''); 
            setCustomers(response.data);
            setCurrentPage(1);
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

    const indexOfLastCustomer = currentPage * itemsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(customers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                        {currentCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No customers found. Upload an Excel file or create one manually.
                                </td>
                            </tr>
                        ) : (
                            currentCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{customer.id}</td>
                                    <td className="px-6 py-4 text-white">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.dob}</td>
                                    <td className="px-6 py-4">{customer.nic}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        
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

            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-800">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-semibold text-white">{indexOfFirstCustomer + 1}</span> to <span className="font-semibold text-white">{Math.min(indexOfLastCustomer, customers.length)}</span> of <span className="font-semibold text-white">{customers.length}</span> Entries
                    </span>
                    <div className="inline-flex space-x-2">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-500 bg-gray-700 cursor-not-allowed' : 'text-white bg-gray-600 hover:bg-gray-500 transition-colors'}`}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button 
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentPage === index + 1 ? 'text-white bg-blue-600' : 'text-gray-400 bg-gray-700 hover:bg-gray-600 hover:text-white'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-500 bg-gray-700 cursor-not-allowed' : 'text-white bg-gray-600 hover:bg-gray-500 transition-colors'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {viewingCustomer && (
                <CustomerDetailsModal 
                    customer={viewingCustomer} 
                    onClose={() => setViewingCustomer(null)} 
                />
            )}
        </div>
    );
}