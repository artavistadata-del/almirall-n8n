import { PackageOpen, Clock, Layers, ArrowUpRight, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { StockItem, UserRole } from '@/types';

interface ControlPanelProps {
  userRole: UserRole;
  stokMaster: StockItem[];
  totalPending: number;
  totalRevenue: number;
  onRestock: (id: number, quantity: number) => void;
}

export function ControlPanel({ userRole, stokMaster, totalPending, totalRevenue }: ControlPanelProps) {
  const totalStock = stokMaster.reduce((sum, item) => sum + item.jumlah, 0);
  const uniqueItems = stokMaster.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Primary Dark Card (Total Revenue) */}
      <div className="bg-almirall-primary text-white p-5 rounded-2xl shadow-[0_8px_20px_rgba(0,45,84,0.2)] relative overflow-hidden flex flex-col justify-between h-[160px]">
        <div className="flex justify-between items-start relative z-10">
          <div className="bg-white text-gray-900 p-2 rounded-xl">
             <BarChart3 size={18} />
          </div>
          <div className="inline-flex items-center gap-1 bg-almirall-accent px-2.5 py-1 rounded-full text-[10px] font-bold text-almirall-primary">
            +12.8%
          </div>
        </div>
        <div className="relative z-10 mt-auto">
          <p className="text-xs font-medium text-white/70 mb-1">Total Sales</p>
          <div className="flex items-baseline gap-2 w-full">
              <p className="text-3xl font-extrabold text-white mt-1 tracking-tight truncate w-full">
              € {totalRevenue > 0 ? (totalRevenue).toFixed(2) : '0'}
              </p>
          </div>
        </div>
      </div>

      {/* Card 2: White Card (Total Stock) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[160px]">
        <div className="flex justify-between items-start">
          <div className="bg-gray-50 text-gray-900 p-2 rounded-xl border border-gray-100">
             <Layers size={18} />
          </div>
          <div className="inline-flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-green-600">
            +5.4%
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-xs font-medium text-gray-500 mb-1">Total Stock</p>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalStock.toLocaleString()}</p>
        </div>
      </div>

      {/* Card 3: White Card (Pending Orders) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[160px]">
        <div className="flex justify-between items-start">
          <div className="bg-gray-50 text-gray-900 p-2 rounded-xl border border-gray-100">
             <Clock size={18} />
          </div>
          <div className="inline-flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-red-600">
            -2.1%
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-xs font-medium text-gray-500 mb-1">Pending Orders</p>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalPending}</p>
        </div>
      </div>

      {/* Card 4: White Card (Unique Items) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-[160px]">
        <div className="flex justify-between items-start">
          <div className="bg-gray-50 text-gray-900 p-2 rounded-xl border border-gray-100">
             <PackageOpen size={18} />
          </div>
          <div className="inline-flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-green-600">
            +8.2%
          </div>
        </div>
        <div className="mt-auto">
          <p className="text-xs font-medium text-gray-500 mb-1">Unique Items</p>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{uniqueItems}</p>
        </div>
      </div>

    </div>
  );
}
