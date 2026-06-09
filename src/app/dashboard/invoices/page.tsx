'use client';

import { FileText, Download, SlidersHorizontal, Plus } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2023-001', customer: 'Acme Corp', date: '2023-10-24', amount: '€ 12,500.00', status: 'Paid' },
  { id: 'INV-2023-002', customer: 'Global Tech', date: '2023-10-26', amount: '€ 8,200.00', status: 'Pending' },
  { id: 'INV-2023-003', customer: 'Ferra Beauty', date: '2023-10-28', amount: '€ 45,000.00', status: 'Overdue' },
  { id: 'INV-2023-004', customer: 'Skin Essentials', date: '2023-11-02', amount: '€ 3,100.00', status: 'Paid' },
  { id: 'INV-2023-005', customer: 'Dermacare Plus', date: '2023-11-05', amount: '€ 2,400.00', status: 'Pending' },
];

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h2>
        <p className="text-gray-500 mt-1">Manage and track billing invoices for all customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="px-8 pt-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Invoices</h2>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
                <Download size={16} /> Export
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600 font-semibold bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100">
                <SlidersHorizontal size={16} /> Filter
              </button>
              <button 
                className="flex items-center gap-2 text-sm text-white font-semibold bg-[#1a1c23] px-5 py-2 rounded-full hover:bg-black transition-colors shadow-sm"
              >
                <Plus size={16} /> Create Invoice
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto px-8 pb-8">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-4">Invoice ID</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Date Issued</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-5 font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    {inv.id}
                  </td>
                  <td className="px-4 py-5 font-medium text-gray-700">
                    {inv.customer}
                  </td>
                  <td className="px-4 py-5 text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-4 py-5 font-bold text-gray-900">{inv.amount}</td>
                  <td className="px-4 py-5">
                    {inv.status === 'Paid' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-widest">Paid</span>}
                    {inv.status === 'Pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-widest">Pending</span>}
                    {inv.status === 'Overdue' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 uppercase tracking-widest">Overdue</span>}
                  </td>
                  <td className="px-4 py-5 text-right">
                    <button className="text-almirall-primary font-semibold text-xs bg-almirall-bg px-4 py-2 rounded-full hover:bg-almirall-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      View
                    </button>
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
