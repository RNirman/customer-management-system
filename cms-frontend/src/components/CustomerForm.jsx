import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function CustomerForm({ onCustomerSaved, editingCustomer, setEditingCustomer }) {
    const [formData, setFormData] = useState({ name: '', dob: '', nic: '', mobileNumbers: [] });
    const [currentMobile, setCurrentMobile] = useState(''); 
    
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (editingCustomer) {
            setFormData({
                name: editingCustomer.name,
                dob: editingCustomer.dob,
                nic: editingCustomer.nic,
                mobileNumbers: editingCustomer.mobileNumbers ? [...editingCustomer.mobileNumbers] : []
            });
            setMessage('');
            setStatus('idle');
            setCurrentMobile('');
        } else {
            setFormData({ name: '', dob: '', nic: '', mobileNumbers: [] });
        }
    }, [editingCustomer]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddMobile = (e) => {
        e.preventDefault();
        if (currentMobile.trim() !== '') {
            setFormData({
                ...formData,
                mobileNumbers: [...formData.mobileNumbers, currentMobile.trim()]
            });
            setCurrentMobile(''); // Clear the input field after adding
        }
    };

    const handleRemoveMobile = (indexToRemove) => {
        setFormData({
            ...formData,
            mobileNumbers: formData.mobileNumbers.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            if (editingCustomer) {
                await apiClient.put(`/${editingCustomer.id}`, formData);
                setMessage('Customer updated successfully!');
            } else {
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
        setFormData({ name: '', dob: '', nic: '', mobileNumbers: [] });
        setCurrentMobile('');
        setMessage('');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full flex-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                    {editingCustomer ? 'Update Customer' : 'Add New Customer'}
                </h2>
                {editingCustomer && (
                    <button type="button" onClick={handleCancel} className="text-sm text-gray-400 hover:text-white">
                        Cancel Edit
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="pt-2 border-t border-gray-700 mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Numbers (Optional)</label>
                    <div className="flex space-x-2 mb-2">
                        <input 
                            type="text" 
                            value={currentMobile} 
                            onChange={(e) => setCurrentMobile(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddMobile(e); }}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            placeholder="+94 77 123 4567" 
                        />
                        <button 
                            type="button" 
                            onClick={handleAddMobile}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {formData.mobileNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.mobileNumbers.map((num, index) => (
                                <span key={index} className="inline-flex items-center bg-blue-900 text-blue-200 text-sm px-3 py-1 rounded-full">
                                    {num}
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveMobile(index)}
                                        className="ml-2 text-blue-400 hover:text-white focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={status === 'loading'} className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors mt-6 ${status === 'loading' ? 'bg-blue-800 cursor-not-allowed' : (editingCustomer ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500')}`}>
                    {status === 'loading' ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Save Customer')}
                </button>

                {status === 'error' && <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-md mt-3">{message}</div>}
                {status === 'success' && <div className="text-green-400 text-sm p-3 bg-green-900/30 rounded-md mt-3">{message}</div>}
            </form>
        </div>
    );
}