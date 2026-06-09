'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, PackageOpen, AlertTriangle, DollarSign } from 'lucide-react';
import { InventoryBarChart } from '@/components/DashboardCharts';

export default function InventoryPage() {
  const { stokMaster, handleRestock, userRole } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');

  const totalStock = stokMaster.reduce((sum, item) => sum + item.jumlah, 0);
  const lowStockItems = stokMaster.filter(item => item.jumlah > 0 && item.jumlah <= 50).length;
  const outOfStockItems = stokMaster.filter(item => item.jumlah === 0).length;
  const totalValue = stokMaster.reduce((sum, item) => sum + (item.jumlah * item.harga), 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && quantity && Number(quantity) > 0) {
      handleRestock(Number(selectedItem), Number(quantity));
      setQuantity('');
      setSelectedItem('');
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-2xl shadow-sm">
        You do not have permission to access the inventory system.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Control</h2>
        <p className="text-gray-500 mt-1">Manage stock levels, manually restock items, and view inventory analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-almirall-primary p-6 rounded-2xl shadow-[0_8px_20px_rgba(0,45,84,0.2)] flex items-center gap-5 text-white">
          <div className="bg-white/10 p-4 rounded-2xl text-white">
            <PackageOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70 mb-1">Total Stock</p>
            <p className="text-3xl font-bold">{totalStock.toLocaleString()}</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Attention Needed</p>
            <div className="flex items-center gap-2">
               <p className="text-xl font-bold text-gray-900">{outOfStockItems} <span className="text-xs text-red-500 font-semibold">Out</span></p>
               <span className="text-gray-300">|</span>
               <p className="text-xl font-bold text-gray-900">{lowStockItems} <span className="text-xs text-amber-500 font-semibold">Low</span></p>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Est. Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900">€ {(totalValue).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="xl:col-span-4 flex flex-col">
          {/* Restock Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manual Restock</h2>
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full bg-[#f8f9fa] border border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-all text-gray-700"
                  required
                >
                  <option value="" disabled>Choose a product...</option>
                  {stokMaster.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_barang} (Stock: {item.jumlah})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-[#f8f9fa] border border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-all text-gray-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-almirall-primary hover:bg-almirall-primary/90 text-white py-4 rounded-xl font-semibold text-[15px] transition-all shadow-md active:scale-[0.98] mt-6"
              >
                <Plus size={18} />
                Add Stock to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="xl:col-span-8 flex">
          <InventoryBarChart stokMaster={stokMaster} />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory List</h2>
          <p className="text-sm text-gray-500">Comprehensive view of all products in stock.</p>
        </div>
        <div className="overflow-x-auto px-8 pb-8">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-4">Product ID</th>
                <th className="px-4 py-4">Product Name</th>
                <th className="px-4 py-4">Current Stock</th>
                <th className="px-4 py-4">Value</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stokMaster.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-5 font-medium text-gray-500">
                    PRD-{String(item.id).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-5 font-bold text-gray-900">
                    {item.nama_barang}
                  </td>
                  <td className="px-4 py-5">
                    <span className="font-bold text-gray-900 text-[15px]">{item.jumlah}</span> <span className="text-gray-400 text-xs">units</span>
                  </td>
                  <td className="px-4 py-5 font-bold text-gray-700">
                    € {(item.jumlah * item.harga).toFixed(2)}
                  </td>
                  <td className="px-4 py-5">
                    {item.jumlah > 50 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-widest">In Stock</span>
                    ) : item.jumlah > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-widest">Low Stock</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 uppercase tracking-widest">Out of Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
