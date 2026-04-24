import { useState } from 'react';
import apiClient from '../api/apiClient';

export default function BulkUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setStatus('success');
            setMessage(response.data);
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
            
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data || 'Failed to upload file. Please try again.');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full flex-1">
            <h2 className="text-xl font-semibold text-white mb-4">Bulk Customer Upload</h2>
            
            <div className="flex flex-col space-y-4">
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-600 file:text-white
                               hover:file:bg-blue-500 cursor-pointer"
                />

                <button 
                    onClick={handleUpload} 
                    disabled={status === 'loading'}
                    className={`py-2 px-4 rounded-md font-medium text-white transition-colors
                        ${status === 'loading' 
                            ? 'bg-blue-800 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                    {status === 'loading' ? 'Processing File...' : 'Upload Data'}
                </button>

                {status === 'error' && (
                    <div className="text-red-400 text-sm p-3 bg-red-900/30 rounded-md">
                        {message}
                    </div>
                )}
                {status === 'success' && (
                    <div className="text-green-400 text-sm p-3 bg-green-900/30 rounded-md">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}