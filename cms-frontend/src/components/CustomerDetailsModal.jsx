export default function CustomerDetailsModal({ customer, onClose }) {
    if (!customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                
                {/* Header */}
                <div className="flex justify-between items-center bg-gray-900 px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Customer Details</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-400">Database ID</p>
                        <p className="text-white font-semibold text-lg">#{customer.id}</p>
                    </div>
                    
                    <div>
                        <p className="text-sm font-medium text-gray-400">Full Name</p>
                        <p className="text-white font-semibold text-lg">{customer.name}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-400">Date of Birth</p>
                        <p className="text-white font-semibold text-lg">{customer.dob}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-400">National Identity Card (NIC)</p>
                        <p className="text-white font-semibold text-lg">{customer.nic}</p>
                    </div>

                    {/* Placeholder for future expansion */}
                    <div className="pt-4 mt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500 italic">
                            * Additional attributes like Mobile Numbers and Addresses will appear here when configured.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}