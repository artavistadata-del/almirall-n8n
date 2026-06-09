'use client';

import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { UserRole } from '@/types';
import { 
  Bell, FileScan, Download, Menu, 
  ChevronLeft, ChevronRight, Search, CircleAlert, Settings, ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  onSimulateMock: () => void;
  onScanClick: () => void;
  onLogout: () => void;
  onMenuClick?: () => void;
}

import { useState } from 'react';
import Link from 'next/link';

export function Header({ userRole, onSimulateMock, onScanClick, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, notifications, markNotificationsAsRead } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  // Helper to format pathname to breadcrumbs
  const getPageName = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/orders') return 'Orders';
    if (pathname === '/dashboard/inventory') return 'Products';
    if (pathname === '/dashboard/consumer') return 'Customers';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };

  const handleSimulateMock = () => {
    const link = document.createElement('a');
    link.href = '/facture.png';
    link.download = 'facture.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Removed onSimulateMock() to prevent processing
  };

  return (
    <header className="bg-transparent mb-8 flex justify-between items-center w-full">
      {/* Left Section: Breadcrumbs & Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700 hover:bg-gray-50"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-1 text-gray-400">
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
            <ChevronRight size={18} />
          </button>
          <div className="ml-3 flex items-center gap-2 text-sm">
            <span>Pages</span>
            <span>/</span>
            <span className="font-semibold text-gray-800">{getPageName()}</span>
          </div>
        </div>
      </div>

      {/* Center & Right Section */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        
        {/* Search Bar */}
        <div className="hidden md:flex relative max-w-sm w-full mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, categories, or more..." 
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-almirall-primary focus:border-almirall-primary sm:text-sm transition-colors shadow-sm"
          />
        </div>

        {/* Scan Actions */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200">

          <button 
            onClick={onScanClick}
            className="flex items-center gap-2 bg-almirall-primary text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-almirall-primary/90 transition-all shadow-sm"
          >
            <FileScan size={16} />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>

        {/* Utility Icons */}
        <div className="flex items-center gap-2 text-gray-500">
          <button className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all">
            <CircleAlert size={18} />
          </button>
          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white bg-almirall-danger rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simple Profile */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {userRole === 'admin' ? 'FA' : 'MU'}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </div>
        </div>

      </div>
    </header>
  );
}
