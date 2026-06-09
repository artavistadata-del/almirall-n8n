'use client';

import { TransactionTable } from '@/components/TransactionTable';
import { useAppContext } from '@/context/AppContext';
import { ScanLine, FileDown } from 'lucide-react';

export default function OrdersPage() {
  const { userRole, riwayatTransaksi, handleConfirmOrder, triggerFileInput, simulateMockScan } = useAppContext();

  const handleDownloadFacture = () => {
    const link = document.createElement('a');
    link.href = '/facture.png';
    link.download = 'facture.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h2>
          <p className="text-gray-500 mt-1">Manage and confirm incoming document scans.</p>
        </div>
        
        {userRole === 'admin' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFacture}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
              title="Download Facture Image"
            >
              <FileDown size={18} />
            </button>
            <button
              onClick={triggerFileInput}
              className="flex items-center gap-2 bg-[#002D54] text-white px-5 h-11 rounded-full text-sm font-bold hover:bg-black transition-all shadow-[0_4px_10px_rgba(0,0,0,0.15)] active:scale-95"
            >
              <ScanLine size={16} />
              <span>Scan Order</span>
            </button>
          </div>
        )}
      </div>
      
      <TransactionTable userRole={userRole} transactions={riwayatTransaksi} onConfirm={handleConfirmOrder} onAddOrder={simulateMockScan} />
    </>
  );
}
