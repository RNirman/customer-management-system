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
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Database ID</p>
                            <p className="text-white font-semibold">#{customer.id}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                            <p className="text-white font-semibold">{customer.dob}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-white font-semibold text-lg">{customer.name}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">NIC</p>
                            <p className="text-white font-semibold">{customer.nic}</p>
                        </div>
                    </div>

                    <hr className="border-gray-700" />

                    {/* Mobile Numbers Section */}
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Mobile Numbers</p>
                        {customer.mobileNumbers && customer.mobileNumbers.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {customer.mobileNumbers.map((num, idx) => (
                                    <span key={idx} className="bg-gray-700 text-blue-300 text-sm px-3 py-1 rounded-full border border-gray-600">
                                        {num}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No mobile numbers recorded.</p>
                        )}
                    </div>

                    {/* Family Members Section */}
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Family Network</p>
                        {customer.familyMembers && customer.familyMembers.length > 0 ? (
                            <ul className="space-y-2">
                                {customer.familyMembers.map((member) => (
                                    <li key={member.id} className="flex items-center bg-gray-750 px-3 py-2 rounded-lg border border-gray-700">
                                        <div className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded mr-3">
                                            #{member.id}
                                        </div>
                                        <div className="text-sm text-white font-medium">
                                            {member.name}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No linked family members.</p>
                        )}
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