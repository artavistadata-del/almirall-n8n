'use client';

import { TransactionTable } from '@/components/TransactionTable';
import { useAppContext } from '@/context/AppContext';

export default function TransactionsPage() {
  const { userRole, riwayatTransaksi, handleConfirmOrder } = useAppContext();

  return (
    <>
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions History</h2>
        <p className="text-gray-500 mt-1">View and monitor all financial transactions and order histories.</p>
      </div>
      
      {/* We reuse the TransactionTable here as it acts as our main ledger */}
      <TransactionTable userRole={userRole} transactions={riwayatTransaksi} onConfirm={handleConfirmOrder} />
    </>
  );
}
