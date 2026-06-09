'use client';

import { ControlPanel } from '@/components/ControlPanel';
import { InventoryBarChart, OrderStatusChart, CustomerGrowthChart, RevenueAnalyticsChart } from '@/components/DashboardCharts';
import { useAppContext } from '@/context/AppContext';

export default function DashboardHome() {
  const { userRole, stokMaster, totalPending, totalRevenue, handleRestock, isUploading } = useAppContext();

  return (
    <>
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-2xl text-sm border border-blue-100 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          Processing order document via AI Vision, please wait...
        </div>
      )}
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
        {/* Left column: KPIs + Bar Chart + Area Chart */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <ControlPanel
            userRole={userRole}
            stokMaster={stokMaster}
            totalPending={totalPending}
            totalRevenue={totalRevenue}
            onRestock={handleRestock}
          />
          <InventoryBarChart stokMaster={stokMaster} />
          <RevenueAnalyticsChart />
        </div>
        
        {/* Right column: Donut Charts */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <OrderStatusChart riwayatTransaksi={useAppContext().riwayatTransaksi} />
          <CustomerGrowthChart />
        </div>
      </div>
    </>
  );
}
