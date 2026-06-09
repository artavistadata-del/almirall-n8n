'use client';

import { useState } from 'react';
import { Transaction, UserRole } from '@/types';
import { CheckCircle, XCircle, Clock, Plus, SlidersHorizontal, Download } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface TransactionTableProps {
  userRole: UserRole;
  transactions: Transaction[];
  onConfirm: (id: string) => void;
  onAddOrder?: () => void;
}

export function TransactionTable({ userRole, transactions, onConfirm, onAddOrder }: TransactionTableProps) {
  const { stokMaster, addManualOrder, searchQuery } = useAppContext();
  const [filter, setFilter] = useState<string>('ALL');
  const [sortParam, setSortParam] = useState<'default' | 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'>('default');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleManualAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product = formData.get('product') as string;
    const qty = parseInt(formData.get('quantity') as string, 10);
    if (product && qty > 0) {
      addManualOrder(product, qty);
      setShowAddForm(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.status === filter;
    const matchesSearch = tx.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) || tx.id_transaksi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  let sortedTransactions = [...filteredTransactions];
  if (sortParam === 'date-desc') {
    sortedTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } else if (sortParam === 'date-asc') {
    sortedTransactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } else if (sortParam === 'price-desc') {
    sortedTransactions.sort((a, b) => b.total_harga - a.total_harga);
  } else if (sortParam === 'price-asc') {
    sortedTransactions.sort((a, b) => a.total_harga - b.total_harga);
  }

  const handleSortToggle = () => {
    const cycle = ['default', 'date-desc', 'date-asc', 'price-desc', 'price-asc'] as const;
    const nextIdx = (cycle.indexOf(sortParam) + 1) % cycle.length;
    setSortParam(cycle[nextIdx]);
  };

  const handleExport = () => {
    const headers = ['Order ID', 'Date', 'Product Name', 'Quantity', 'Total Value (EUR)', 'Status'];
    const csvContent = sortedTransactions.map(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      return `"${tx.id_transaksi}","${date}","${tx.nama_barang}",${tx.jumlah_pesanan},${tx.total_harga},"${tx.status}"`;
    });
    const csvFile = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'almirall-orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    all: transactions.length,
    draft: transactions.filter(t => t.status === 'DRAFT').length,
    confirmed: transactions.filter(t => t.status === 'CONFIRMED').length,
    out: transactions.filter(t => t.status === 'OUT OF STOCK').length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      
      {/* Header Area */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Order list</h2>
          <div className="flex gap-4">
            <button onClick={handleExport} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
              <Download size={16} /> Export
            </button>
            <button onClick={handleSortToggle} className="flex items-center gap-2 text-sm text-gray-600 font-semibold bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 min-w-[140px] justify-center">
              <SlidersHorizontal size={16} /> Sort: <span className="text-gray-400 truncate max-w-[80px]">{sortParam}</span>
            </button>
            {userRole === 'admin' && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-sm text-white font-semibold bg-[#1a1c23] px-5 py-2 rounded-full hover:bg-black transition-colors shadow-sm"
              >
                <Plus size={16} /> Add order
              </button>
            )}
          </div>
        </div>

        {/* Add Manual Order Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full mx-4 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Add Manual Order</h3>
              <form className="flex flex-col gap-5" onSubmit={handleManualAdd}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
                  <select name="product" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" required>
                    <option value="">-- Choose a product --</option>
                    {stokMaster.map(item => (
                      <option key={item.id} value={item.nama_barang}>{item.nama_barang} (Stock: {item.jumlah})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                  <input type="number" name="quantity" min="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" required />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold text-white bg-almirall-primary hover:bg-almirall-primary/90 transition-colors shadow-sm">Save Order</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
          <button 
            onClick={() => setFilter('ALL')}
            className={`p-4 rounded-2xl flex flex-col items-start transition-all ${filter === 'ALL' ? 'bg-[#5942f4] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
          >
            <span className={`text-sm font-medium mb-1 ${filter === 'ALL' ? 'text-white/80' : 'text-gray-500'}`}>All orders</span>
            <span className="text-3xl font-bold">{stats.all}</span>
          </button>
          
          <button 
            onClick={() => setFilter('DRAFT')}
            className={`p-4 rounded-2xl flex flex-col items-start transition-all ${filter === 'DRAFT' ? 'bg-[#fbbf24] text-white shadow-md' : 'bg-[#fffbeb] text-amber-900 hover:bg-[#fef3c7]'}`}
          >
            <span className={`text-sm font-medium mb-1 ${filter === 'DRAFT' ? 'text-white/80' : 'text-amber-700/70'}`}>Pending</span>
            <span className="text-3xl font-bold">{stats.draft}</span>
          </button>

          <button 
            onClick={() => setFilter('CONFIRMED')}
            className={`p-4 rounded-2xl flex flex-col items-start transition-all ${filter === 'CONFIRMED' ? 'bg-[#00E6A7] text-white shadow-md' : 'bg-[#e6fcf5] text-emerald-900 hover:bg-[#ccfbf0]'}`}
          >
            <span className={`text-sm font-medium mb-1 ${filter === 'CONFIRMED' ? 'text-white/80' : 'text-emerald-700/70'}`}>Confirmed</span>
            <span className="text-3xl font-bold">{stats.confirmed}</span>
          </button>

          <button 
            onClick={() => setFilter('OUT OF STOCK')}
            className={`p-4 rounded-2xl flex flex-col items-start transition-all ${filter === 'OUT OF STOCK' ? 'bg-[#EF4444] text-white shadow-md' : 'bg-[#fef2f2] text-red-900 hover:bg-[#fee2e2]'}`}
          >
            <span className={`text-sm font-medium mb-1 ${filter === 'OUT OF STOCK' ? 'text-white/80' : 'text-red-700/70'}`}>Out of Stock</span>
            <span className="text-3xl font-bold">{stats.out}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-8 pb-8">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold border-b border-gray-100">
            <tr>
              <th className="px-4 py-4">Order ID / Date</th>
              <th className="px-4 py-4">Product Name</th>
              <th className="px-4 py-4">Quantity</th>
              <th className="px-4 py-4">Est. Value</th>
              <th className="px-4 py-4">Status</th>
              {userRole === 'admin' && (
                <th className="px-4 py-4 text-right">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'admin' ? 6 : 5} className="px-4 py-12 text-center text-gray-400 font-medium bg-gray-50/50 rounded-xl mt-4">
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id_transaksi} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-5 whitespace-nowrap">
                    <p className="font-bold text-gray-900 text-[13px]">{tx.id_transaksi.split('-')[0] + '-' + tx.id_transaksi.split('-')[1].slice(-4)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-5 font-bold text-gray-700 text-[13px]">
                    {tx.nama_barang}
                  </td>
                  <td className="px-4 py-5 text-gray-600 font-medium">
                    {tx.jumlah_pesanan} <span className="text-gray-400 text-xs font-normal">units</span>
                  </td>
                  <td className="px-4 py-5 font-bold text-gray-700">
                    € {tx.total_harga.toFixed(2)}
                  </td>
                  <td className="px-4 py-5">
                    {tx.status === 'CONFIRMED' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-widest">Confirmed</span>}
                    {tx.status === 'DRAFT' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-widest">Pending</span>}
                    {tx.status === 'OUT OF STOCK' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest">Stock Out</span>}
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-4 py-5 text-right">
                      {tx.status === 'DRAFT' ? (
                        <button
                          onClick={() => onConfirm(tx.id_transaksi)}
                          className="text-white font-semibold text-xs bg-almirall-primary px-4 py-2 rounded-full hover:bg-almirall-primary/90 transition-all shadow-sm"
                        >
                          Confirm
                        </button>
                      ) : (
                        <span className="text-gray-300">•••</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
