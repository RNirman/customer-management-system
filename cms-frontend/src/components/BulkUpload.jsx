import { useState, useRef } from 'react';
import apiClient from '../api/apiClient';

export default function BulkUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [processedRows, setProcessedRows] = useState(0);
    const pollingIntervalRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
            setProcessedRows(0);
        }
    };

    const pollStatus = async (jobId) => {
        try {
            const response = await apiClient.get(`/upload/status/${jobId}`);
            const data = response.data;
            
            if (data.status === 'PROCESSING') {
                setProcessedRows(data.processedRows);
            } else if (data.status === 'COMPLETED') {
                clearInterval(pollingIntervalRef.current);
                setStatus('success');
                setMessage('Bulk upload completed successfully!');
                setFile(null);
                setProcessedRows(0);
                if (onUploadSuccess) onUploadSuccess();
            } else if (data.status === 'FAILED') {
                clearInterval(pollingIntervalRef.current);
                setStatus('error');
                setMessage(`Upload failed: ${data.errorMessage}`);
                setProcessedRows(0);
            }
        } catch (error) {
            console.error("Error polling status", error);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setProcessedRows(0);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setMessage(response.data.message || 'Processing started...');
            const jobId = response.data.jobId;
            
            if (jobId) {
                // Start polling every 2 seconds
                pollingIntervalRef.current = setInterval(() => pollStatus(jobId), 2000);
            }
            
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

                {status === 'loading' && processedRows > 0 && (
                    <div className="text-blue-400 text-sm p-3 bg-blue-900/30 rounded-md">
                        Progress: Processed {processedRows.toLocaleString()} records...
                    </div>
                )}
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