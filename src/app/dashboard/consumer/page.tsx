'use client';

import { useState } from 'react';
import { Users, UserPlus, Activity, Download, SlidersHorizontal, Plus } from 'lucide-react';

const mockCustomers = [
  { id: 'CUS-001', name: 'Acme Corp', email: 'contact@acme.com', location: 'United States', status: 'Active', orders: 24, spent: '€ 45,200.00' },
  { id: 'CUS-002', name: 'Global Tech', email: 'billing@globaltech.com', location: 'Germany', status: 'Active', orders: 18, spent: '€ 32,100.00' },
  { id: 'CUS-003', name: 'Dermacare Plus', email: 'hello@dermacare.com', location: 'Australia', status: 'Inactive', orders: 3, spent: '€ 2,400.00' },
  { id: 'CUS-004', name: 'Ferra Beauty', email: 'admin@ferrabeauty.com', location: 'France', status: 'Active', orders: 42, spent: '€ 89,500.00' },
  { id: 'CUS-005', name: 'Skin Essentials', email: 'orders@skinessentials.com', location: 'United States', status: 'Active', orders: 12, spent: '€ 15,800.00' },
];

export default function ConsumerPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');

  const filteredCustomers = mockCustomers.filter(c => filter === 'ALL' || c.status === filter);

  const handleFilterToggle = () => {
    const cycle = ['ALL', 'Active', 'Inactive'] as const;
    const nextIdx = (cycle.indexOf(filter) + 1) % cycle.length;
    setFilter(cycle[nextIdx]);
  };

  const handleExport = () => {
    const headers = ['Customer ID', 'Company Name', 'Email', 'Location', 'Status', 'Orders', 'Total Spent'];
    const csvContent = filteredCustomers.map(cus => 
      `"${cus.id}","${cus.name}","${cus.email}","${cus.location}","${cus.status}",${cus.orders},"${cus.spent}"`
    );
    const csvFile = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'almirall-customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Consumers</h2>
        <p className="text-gray-500 mt-1">Manage customer relationships and view activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">5,829</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Customers</p>
            <p className="text-3xl font-bold text-gray-900">4,192</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-almirall-primary p-6 rounded-2xl shadow-[0_8px_20px_rgba(0,45,84,0.2)] flex items-center gap-5 text-white">
          <div className="bg-white/10 p-4 rounded-2xl text-white">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70 mb-1">New This Month</p>
            <p className="text-3xl font-bold">284</p>
          </div>
        </div>
      </div>

      {/* Add New Customer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Customer</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setShowAddForm(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                <input type="text" className="w-full bg-[#f8f9fa] border border-transparent rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" className="w-full bg-[#f8f9fa] border border-transparent rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input type="text" className="w-full bg-[#f8f9fa] border border-transparent rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:bg-white focus:border-almirall-primary transition-colors" required />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold text-white bg-almirall-primary hover:bg-almirall-primary/90 transition-colors shadow-sm">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="px-8 pt-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Directory</h2>
              <p className="text-sm text-gray-500 mt-1">List of all registered consumers.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleExport} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
                <Download size={16} /> Export
              </button>
              <button onClick={handleFilterToggle} className="flex items-center gap-2 text-sm text-gray-600 font-semibold bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 min-w-[120px] justify-center">
                <SlidersHorizontal size={16} /> Filter: <span className="text-gray-400">{filter}</span>
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 text-sm text-white font-semibold bg-[#1a1c23] px-5 py-2 rounded-full hover:bg-black transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Customer
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto px-8 pb-8">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-4">Customer ID</th>
                <th className="px-4 py-4">Company Name</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Total Spent</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 font-medium bg-gray-50/50 rounded-xl mt-4">
                    No customers match this filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cus) => (
                  <tr key={cus.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-5 font-medium text-gray-500">{cus.id}</td>
                    <td className="px-4 py-5 font-bold text-gray-900">
                      {cus.name}
                      <p className="text-xs text-gray-400 font-normal">{cus.email}</p>
                    </td>
                    <td className="px-4 py-5 text-gray-600">{cus.location}</td>
                    <td className="px-4 py-5 font-bold text-gray-700">{cus.spent}</td>
                    <td className="px-4 py-5">
                      {cus.status === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-widest">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-widest">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
