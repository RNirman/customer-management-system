import { useState } from 'react';
import BulkUpload from './components/BulkUpload';
import CustomerTable from './components/CustomerTable';
import CustomerForm from './components/CustomerForm';

function App() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleUploadSuccess = () => {
    setRefreshCount(prev => prev + 1);
  };

  // This single function refreshes the table whenever an upload OR a form submission succeeds
  const handleDataChanged = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-6">
      <div className="max-w-5xl w-full mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Customer Management System</h1>
        <p className="text-gray-400">Manage individuals, family networks, and bulk imports.</p>
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-6 mb-8">
        <CustomerForm 
            onCustomerSaved={handleDataChanged} 
            editingCustomer={editingCustomer} 
            setEditingCustomer={setEditingCustomer}
        />
        <BulkUpload onUploadSuccess={handleDataChanged} />
      </div>

      <CustomerTable 
          refreshTrigger={refreshCount} 
          onEditCustomer={setEditingCustomer}
      />
    </div>
  );
}

export default App;