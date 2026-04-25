import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import CustomerDetailsModal from './CustomerDetailsModal';

export default function CustomerTable({ refreshTrigger, onEditCustomer }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchCustomers(currentPage, debouncedSearchTerm);
    }, [refreshTrigger, currentPage, debouncedSearchTerm]);

    const fetchCustomers = async (page, search = '') => {
        try {
            setLoading(true);
            // Spring uses 0-indexed pagination
            const queryParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const response = await apiClient.get(`?page=${page - 1}&size=${itemsPerPage}${queryParam}`); 
            setCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
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
                fetchCustomers(currentPage, debouncedSearchTerm);
            } catch (err) {
                alert("Failed to delete customer.");
            }
        }
    };

    if (loading) return <div className="text-gray-400 p-4">Loading customers...</div>;
    if (error) return <div className="text-red-400 p-4">{error}</div>;

    const indexOfFirstCustomer = (currentPage - 1) * itemsPerPage;
    const indexOfLastCustomer = Math.min(indexOfFirstCustomer + itemsPerPage, totalElements);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden w-full max-w-5xl mt-8">
            <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white">Customer Directory</h2>
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <input 
                        type="text"
                        placeholder="Search by Name or NIC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 p-2.5"
                    />
                    <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                        {totalElements} Records
                    </span>
                </div>
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
                        Showing <span className="font-semibold text-white">{indexOfFirstCustomer + 1}</span> to <span className="font-semibold text-white">{indexOfLastCustomer}</span> of <span className="font-semibold text-white">{totalElements}</span> Entries
                    </span>
                    <div className="inline-flex space-x-2">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-500 bg-gray-700 cursor-not-allowed' : 'text-white bg-gray-600 hover:bg-gray-500 transition-colors'}`}
                        >
                            Prev
                        </button>
                        {(() => {
                            const visiblePages = new Set([1, totalPages, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]);
                            const sortedPages = Array.from(visiblePages).filter(p => p >= 1 && p <= totalPages).sort((a,b) => a-b);
                            
                            return sortedPages.map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && page - array[index - 1] > 1 && (
                                        <span className="px-2 py-1 text-sm font-medium text-gray-500">...</span>
                                    )}
                                    <button 
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentPage === page ? 'text-white bg-blue-600' : 'text-gray-400 bg-gray-700 hover:bg-gray-600 hover:text-white'}`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ));
                        })()}
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