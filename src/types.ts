export interface StockItem {
  id: number;
  nama_barang: string;
  jumlah: number;
  harga: number;
  sku?: string;
  batch_no?: string;
  expired_date?: string;
  unit?: string;
}

export type TransactionStatus = 'DRAFT' | 'CONFIRMED' | 'OUT OF STOCK';

export interface Transaction {
  id_transaksi: string;
  timestamp: string;
  nama_barang: string;
  jumlah_pesanan: number;
  harga_satuan: number;
  total_harga: number;
  status: TransactionStatus;
  sku?: string;
  batch_no?: string;
  expired_date?: string;
  unit?: string;
}

export type UserRole = 'admin' | 'supply_chain' | null;
