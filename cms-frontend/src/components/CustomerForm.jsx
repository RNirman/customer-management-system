import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function CustomerForm({ onCustomerSaved, editingCustomer, setEditingCustomer }) {
    const [formData, setFormData] = useState({ name: '', dob: '', nic: '' });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    // Watch for the editingCustomer prop. If it changes, populate the form!
    useEffect(() => {
        if (editingCustomer) {
            setFormData({
                name: editingCustomer.name,
                dob: editingCustomer.dob,
                nic: editingCustomer.nic
            });
            setMessage('');
            setStatus('idle');
        } else {
            setFormData({ name: '', dob: '', nic: '' }); // Reset if null
        }
    }, [editingCustomer]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            if (editingCustomer) {
                // UPDATE Mode
                await apiClient.put(`/${editingCustomer.id}`, formData);
                setMessage('Customer updated successfully!');
            } else {
                // CREATE Mode
                await apiClient.post('', formData);
                setMessage('Customer created successfully!');
            }

            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
            if (onCustomerSaved) onCustomerSaved();

        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to save. Check unique constraints.');
        }
    };

    const handleCancel = () => {
        setEditingCustomer(null);
        setFormData({ name: '', dob: '', nic: '' });
        setMessage('');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                    {editingCustomer ? 'Update Customer' : 'Add New Customer'}
                </h2>
                {editingCustomer && (
                    <button onClick={handleCancel} className="text-sm text-gray-400 hover:text-white">
                        Cancel Edit
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Keep your existing Name, DOB, and NIC inputs exactly the same) ... */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth *</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">NIC Number *</label>
                    <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="199012345678" />
                </div>

                <button type="submit" disabled={status === 'loading'} className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors mt-4 ${status === 'loading' ? 'bg-blue-800 cursor-not-allowed' : (editingCustomer ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500')}`}>
                    {status === 'loading' ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Save Customer')}
                </button>

                {status === 'error' && <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-md mt-3">{message}</div>}
                {status === 'success' && <div className="text-green-400 text-sm p-3 bg-green-900/30 rounded-md mt-3">{message}</div>}
            </form>
        </div>
    );
}