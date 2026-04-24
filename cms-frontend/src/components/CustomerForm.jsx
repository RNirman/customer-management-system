import { useState } from 'react';
import apiClient from '../api/apiClient';

export default function CustomerForm({ onCustomerAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        nic: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            // Sends a POST request to /api/customers
            await apiClient.post('', formData);
            setStatus('success');
            setMessage('Customer created successfully!');
            setFormData({ name: '', dob: '', nic: '' }); // Reset form
            
            if (onCustomerAdded) onCustomerAdded(); // Trigger table refresh
            
            // Clear success message after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            setStatus('error');
            // Check if the backend sent a specific error (like Duplicate NIC)
            setMessage(error.response?.data?.message || 'Failed to save customer. Check if NIC is unique.');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Customer</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth *</label>
                    <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">NIC Number *</label>
                    <input 
                        type="text" 
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="199012345678"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors mt-4
                        ${status === 'loading' 
                            ? 'bg-blue-800 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                    {status === 'loading' ? 'Saving...' : 'Save Customer'}
                </button>

                {/* Status Messages */}
                {status === 'error' && (
                    <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-md mt-3">
                        {message}
                    </div>
                )}
                {status === 'success' && (
                    <div className="text-green-400 text-sm p-3 bg-green-900/30 rounded-md mt-3">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}