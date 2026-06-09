'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { Transaction, StockItem, UserRole } from '@/types';

// Mock initial data
const initialTransactions: Transaction[] = [
  { id_transaksi: 'TRX-001', timestamp: new Date(Date.now() - 3600000).toISOString(), nama_barang: 'Klisyri Ointment 1% 60 g', jumlah_pesanan: 50, harga_satuan: 68.5, total_harga: 3425.0, status: 'CONFIRMED' },
  { id_transaksi: 'TRX-002', timestamp: new Date(Date.now() - 7200000).toISOString(), nama_barang: 'Wynzora Cream 60 g', jumlah_pesanan: 120, harga_satuan: 37.2, total_harga: 4464.0, status: 'DRAFT' },
  { id_transaksi: 'TRX-003', timestamp: new Date(Date.now() - 86400000).toISOString(), nama_barang: 'Epiduo Gel 0,1% / 2,5% 30 g', jumlah_pesanan: 80, harga_satuan: 23.8, total_harga: 1904.0, status: 'OUT OF STOCK' },
];

const initialStock: StockItem[] = [
  { id: 1, nama_barang: 'Klisyri Ointment 1% 60 g', jumlah: 500, harga: 68.5, sku: 'ALM-KLI003', unit: 'Tube' },
  { id: 2, nama_barang: 'Wynzora Cream 60 g', jumlah: 150, harga: 37.2, sku: 'ALM-WYN004', unit: 'Tube' },
  { id: 3, nama_barang: 'Epiduo Gel 0,1% / 2,5% 30 g', jumlah: 50, harga: 23.8, sku: 'ALM-ACN005', unit: 'Tube' },
  { id: 4, nama_barang: 'Balneum Intensive Lotion 500 ml', jumlah: 240, harga: 14.9, sku: 'ALM-ACF006', unit: 'Bottle' },
  { id: 5, nama_barang: 'Hidroxil Loción 8% 125 ml', jumlah: 100, harga: 8.6, sku: 'ALM-HYD007', unit: 'Bottle' }
];

const N8N_WEBHOOK_URL = 'https://n8n.artavista.net/webhook/dbc3f8bb-7784-444e-aa91-82ed009741ec';

export interface AppNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  stokMaster: StockItem[];
  riwayatTransaksi: Transaction[];
  totalPending: number;
  totalRevenue: number;
  handleRestock: (id: number, quantity: number) => void;
  handleConfirmOrder: (id: string) => void;
  isUploading: boolean;
  triggerFileInput: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  simulateMockScan: () => void;
  addManualOrder: (nama_barang: string, jumlah: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState<Transaction[]>(initialTransactions);
  const [stokMaster, setStokMaster] = useState<StockItem[]>(initialStock);
  const [isUploading, setIsUploading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedDrafts, setScannedDrafts] = useState<Transaction[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalPending = riwayatTransaksi.filter((t) => t.status === 'DRAFT').length;
  const totalRevenue = riwayatTransaksi
    .filter((t) => t.status === 'CONFIRMED')
    .reduce((sum, t) => sum + t.total_harga, 0);

  const handleRestock = (id: number, quantity: number) => {
    setStokMaster((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, jumlah: item.jumlah + quantity } : item
      )
    );
  };

  const handleConfirmOrder = (id: string) => {
    setRiwayatTransaksi((prev) => {
      let changed = false;
      const newTransactions = prev.map((tx) => {
        if (tx.id_transaksi === id && tx.status === 'DRAFT') {
          changed = true;
          return { ...tx, status: 'CONFIRMED' } as Transaction;
        }
        return tx;
      });
      
      if (changed) {
        const orderToConfirm = prev.find(t => t.id_transaksi === id);
        if (orderToConfirm) {
          setStokMaster(currentStock => 
            currentStock.map(item => 
              item.nama_barang === orderToConfirm.nama_barang
                ? { ...item, jumlah: Math.max(0, item.jumlah - orderToConfirm.jumlah_pesanan) }
                : item
            )
          );
        }
      }
      return newTransactions;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addManualOrder = (nama_barang: string, jumlah: number) => {
    const item = stokMaster.find(s => s.nama_barang === nama_barang);
    if (!item) return;
    
    const isOutOfStock = item.jumlah < jumlah;
    
    const newOrder: Transaction = {
      id_transaksi: `MAN-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nama_barang: item.nama_barang,
      jumlah_pesanan: jumlah,
      harga_satuan: item.harga,
      total_harga: jumlah * item.harga,
      status: isOutOfStock ? 'OUT OF STOCK' : 'DRAFT',
      sku: item.sku,
      unit: item.unit
    };
    setRiwayatTransaksi((prev) => [newOrder, ...prev]);
    
    setNotifications((prev) => [{
      id: Date.now().toString(),
      message: `Manual order added: ${jumlah}x ${item.nama_barang}`,
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  const simulateMockScan = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockOrder: Transaction = {
        id_transaksi: `SCAN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        nama_barang: 'Klisyri Ointment 1% 60 g',
        jumlah_pesanan: 50,
        harga_satuan: 68.5,
        total_harga: 3425.0,
        status: 'DRAFT',
      };
      setScannedDrafts([mockOrder]);
      setIsUploading(false);
    }, 1500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (N8N_WEBHOOK_URL.includes('PLACEHOLDER')) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        simulateMockScan();
      } else {
        const formData = new FormData();
        formData.append('data0', file);

        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Identify missing products from the scan
          const missingProducts = data.filter(item => !stokMaster.some(s => s.nama_barang === item.nama_barang));
          
          if (missingProducts.length > 0) {
            // Auto add them to inventory with 0 stock
            const newStockItems: StockItem[] = missingProducts.map((item, idx) => ({
              id: Date.now() + idx,
              nama_barang: item.nama_barang,
              jumlah: 0,
              harga: item.harga_satuan || item.harga || 0,
              sku: item.sku,
              batch_no: item.batch_no,
              expired_date: item.expired_date,
              unit: item.unit
            }));
            
            // We use setStokMaster to append, but for the immediate map below we need the updated array
            setStokMaster(prev => {
              const uniqueNewItems = newStockItems.filter(newI => !prev.some(p => p.nama_barang === newI.nama_barang));
              return [...prev, ...uniqueNewItems];
            });
          }

          const newOrders = data.map((item: any, idx: number): Transaction => {
            // Check if we already had it, otherwise it's 0 stock
            const stockItem = stokMaster.find(s => s.nama_barang === item.nama_barang);
            const stockJumlah = stockItem ? stockItem.jumlah : 0;
            const isOutOfStock = stockJumlah < item.jumlah;

            return {
              id_transaksi: `SCAN-${Date.now()}-${idx}`,
              timestamp: new Date().toISOString(),
              nama_barang: item.nama_barang,
              jumlah_pesanan: item.jumlah,
              harga_satuan: item.harga_satuan || item.harga || 0,
              total_harga: item.total_harga || (item.jumlah * (item.harga_satuan || item.harga || 0)),
              status: isOutOfStock ? 'OUT OF STOCK' : 'DRAFT',
              sku: item.sku,
              batch_no: item.batch_no,
              expired_date: item.expired_date,
              unit: item.unit
            };
          });
          setScannedDrafts(newOrders);
        }
      }
    } catch (error) {
      console.error('Scan failed:', error);
      setScanError('Webhook failed! Please check the console or ensure your n8n workflow is active.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmScannedDrafts = () => {
    if (scannedDrafts) {
      setRiwayatTransaksi((prev) => [...scannedDrafts, ...prev]);
      setNotifications((prev) => [{
        id: Date.now().toString(),
        message: `Imported ${scannedDrafts.length} scanned orders successfully`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
      setScannedDrafts(null);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCancelScannedDrafts = () => {
    setScannedDrafts(null);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        stokMaster,
        riwayatTransaksi,
        totalPending,
        totalRevenue,
        handleRestock,
        handleConfirmOrder,
        isUploading,
        triggerFileInput,
        handleFileUpload,
        simulateMockScan,
        addManualOrder,
        fileInputRef,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationsAsRead,
      }}
    >
      {children}

      {/* Global Loading Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
             <div className="w-12 h-12 rounded-full border-4 border-almirall-primary border-t-transparent animate-spin mb-5"></div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Processing with AI</h3>
             <p className="text-gray-500 text-sm text-center leading-relaxed">
               Reading document and validating products via n8n integration...
             </p>
          </div>
        </div>
      )}

      {/* Global Error Modal */}
      {scanError && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
             <div className="flex items-center gap-4 text-almirall-danger mb-4">
                <div className="p-3 bg-red-50 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Validation Failed</h3>
             </div>
             <p className="text-gray-600 mb-8 leading-relaxed px-1 text-sm">{scanError}</p>
             <div className="flex justify-end w-full">
               <button 
                 onClick={() => setScanError(null)} 
                 className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-black transition-colors w-full sm:w-auto"
               >
                 Dismiss
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Scanned Drafts Confirmation Modal */}
      {scannedDrafts && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col max-w-2xl w-full mx-4 animate-in fade-in zoom-in duration-200">
             <div className="flex items-center gap-4 text-almirall-primary mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Scan Complete</h3>
                  <p className="text-xs text-gray-500 mt-1">Please review the extracted data before importing.</p>
                </div>
             </div>
             
             <div className="bg-gray-50 rounded-xl overflow-hidden mb-6 border border-gray-100 max-h-[40vh] overflow-y-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-100 text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                   <tr>
                     <th className="px-4 py-3">Product Name</th>
                     <th className="px-4 py-3">Qty</th>
                     <th className="px-4 py-3">Price</th>
                     <th className="px-4 py-3">Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   {scannedDrafts.map((draft) => (
                     <tr key={draft.id_transaksi} className="border-b border-gray-100 last:border-0">
                       <td className="px-4 py-3 font-medium text-gray-900">{draft.nama_barang}</td>
                       <td className="px-4 py-3">{draft.jumlah_pesanan}</td>
                       <td className="px-4 py-3">€ {draft.harga_satuan.toFixed(2)}</td>
                       <td className="px-4 py-3 font-bold">€ {draft.total_harga.toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             <div className="flex justify-end gap-3 w-full">
               <button 
                 onClick={handleCancelScannedDrafts} 
                 className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleConfirmScannedDrafts} 
                 className="px-6 py-2.5 bg-almirall-primary text-white rounded-full font-semibold hover:bg-almirall-primary/90 transition-colors shadow-sm"
               >
                 Confirm Import
               </button>
             </div>
          </div>
        </div>
      )}

    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
