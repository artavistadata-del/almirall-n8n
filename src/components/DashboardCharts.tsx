import ReactECharts from 'echarts-for-react';
import { StockItem, Transaction } from '@/types';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

interface InventoryBarChartProps {
  stokMaster: StockItem[];
}

export function InventoryBarChart({ stokMaster }: InventoryBarChartProps) {
  const barOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#f1f5f9',
      textStyle: { color: '#334155' }
    },
    grid: { left: '0%', right: '0%', bottom: '0%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: stokMaster.map(item => item.nama_barang.substring(0, 10) + '...'),
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: { 
      type: 'value',
      splitLine: { show: false },
      axisLabel: { show: false }
    },
    series: [
      {
        name: 'Stock',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00E6A7' },
              { offset: 1, color: '#002D54' }
            ]
          },
          borderRadius: [6, 6, 0, 0] 
        },
        data: stokMaster.map(item => item.jumlah),
        animationDuration: 1000
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Inventory Levels</h2>
          <p className="text-xs text-gray-500 mt-1">Track your product stock</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full">
          This year <ChevronDown size={14} />
        </div>
      </div>
      
      {/* Legend mockup */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
           <div className="w-2 h-2 rounded-full bg-gray-300"></div> Low Stock
        </div>
        <div className="flex items-center gap-1">
           <div className="w-2 h-2 rounded-full bg-almirall-primary"></div> Optimal Stock
        </div>
      </div>

      <ReactECharts option={barOption} style={{ height: '280px', width: '100%' }} />
    </div>
  );
}

interface OrderStatusChartProps {
  riwayatTransaksi: Transaction[];
}

export function OrderStatusChart({ riwayatTransaksi }: OrderStatusChartProps) {
  const statusCounts = riwayatTransaksi.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const doughnutOption = {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.95)' },
    legend: { show: false }, // Using custom legend below
    series: [
      {
        name: 'Order Status',
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 4
        },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: statusCounts['CONFIRMED'] || 0, name: 'Confirmed', itemStyle: { color: '#002D54' } },
          { value: statusCounts['DRAFT'] || 0, name: 'Pending', itemStyle: { color: '#00E6A7' } },
          { value: statusCounts['OUT OF STOCK'] || 0, name: 'Out of Stock', itemStyle: { color: '#EF4444' } }
        ],
        animationDuration: 1000
      }
    ]
  };

  const total = (statusCounts['CONFIRMED'] || 0) + (statusCounts['DRAFT'] || 0) + (statusCounts['OUT OF STOCK'] || 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Order Statistic</h2>
          <p className="text-xs text-gray-500 mt-1">Track your order statuses</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full">
          Today <ChevronDown size={14} />
        </div>
      </div>
      
      <div className="relative mb-6">
        <ReactECharts option={doughnutOption} style={{ height: '220px', width: '100%' }} />
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-[10px] text-gray-500">Total Orders</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-almirall-primary"></div>
             <span className="font-medium text-gray-700">Confirmed</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">{statusCounts['CONFIRMED'] || 0}</span>
             <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">+2.4%</span>
           </div>
        </div>
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-almirall-accent"></div>
             <span className="font-medium text-gray-700">Pending</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">{statusCounts['DRAFT'] || 0}</span>
             <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">+1.2%</span>
           </div>
        </div>
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-almirall-danger"></div>
             <span className="font-medium text-gray-700">Out of Stock</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">{statusCounts['OUT OF STOCK'] || 0}</span>
             <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-0.5%</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerGrowthChart() {
  const doughnutOption = {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255, 255, 255, 0.95)' },
    legend: { show: false },
    series: [
      {
        name: 'Customer Growth',
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 4
        },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 2417, name: 'United States', itemStyle: { color: '#002D54' } },
          { value: 2281, name: 'Germany', itemStyle: { color: '#5942f4' } },
          { value: 812, name: 'Australia', itemStyle: { color: '#fbbf24' } },
          { value: 287, name: 'France', itemStyle: { color: '#00E6A7' } }
        ],
        animationDuration: 1000
      }
    ]
  };

  const total = 2417 + 2281 + 812 + 287;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-auto flex flex-col flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Customer Growth</h2>
          <p className="text-xs text-gray-500 mt-1">Track customer by locations</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full">
          Today <ChevronDown size={14} />
        </div>
      </div>
      
      <div className="relative mb-6">
        <ReactECharts option={doughnutOption} style={{ height: '220px', width: '100%' }} />
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-[10px] text-gray-500">Total Customers</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-sm"><div className="w-full h-full bg-blue-600 relative"><div className="absolute top-0 left-0 w-1/2 h-full bg-white"></div><div className="absolute top-0 left-0 w-full h-1/2 bg-red-600"></div></div></div>
             <span className="font-medium text-gray-700">United States</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">2,417</span>
           </div>
        </div>
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-4 h-3 rounded-sm overflow-hidden flex flex-col shadow-sm"><div className="w-full h-1/3 bg-black"></div><div className="w-full h-1/3 bg-red-600"></div><div className="w-full h-1/3 bg-yellow-400"></div></div>
             <span className="font-medium text-gray-700">Germany</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">2,281</span>
           </div>
        </div>
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-sm bg-blue-900 relative"><div className="absolute top-0 left-0 w-1.5 h-1.5 bg-red-600"></div></div>
             <span className="font-medium text-gray-700">Australia</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">812</span>
           </div>
        </div>
        <div className="flex justify-between items-center text-sm">
           <div className="flex items-center gap-2">
             <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-sm"><div className="w-1/3 h-full bg-blue-600"></div><div className="w-1/3 h-full bg-white"></div><div className="w-1/3 h-full bg-red-600"></div></div>
             <span className="font-medium text-gray-700">France</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-900">287</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export function RevenueAnalyticsChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#f1f5f9',
      textStyle: { color: '#334155' }
    },
    grid: { left: '2%', right: '2%', bottom: '0%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: {
        color: '#94a3b8',
        formatter: '€{value}'
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#002D54', width: 4 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 45, 84, 0.4)' },
              { offset: 1, color: 'rgba(0, 45, 84, 0.0)' }
            ]
          }
        },
        data: [120, 132, 101, 134, 190, 230, 210, 250, 314, 290, 330, 410],
        animationDuration: 1500
      },
      {
        name: 'Target',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#00E6A7', width: 3, type: 'dashed' },
        data: [100, 120, 110, 140, 150, 180, 200, 220, 280, 260, 300, 350],
        animationDuration: 1500
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col flex-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">Monthly performance vs target (in €)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-almirall-primary"></div> Revenue
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-almirall-accent"></div> Target
          </div>
          <div className="flex items-center gap-1 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full text-gray-500 ml-2">
            2026 <ChevronDown size={14} />
          </div>
        </div>
      </div>
      
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} />
    </div>
  );
}
