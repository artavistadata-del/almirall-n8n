'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, PackageSearch, Settings, 
  Users, ChevronDown, ChevronsLeft, Mail, Bell, LogOut, ChartNoAxesColumn, CirclePercent, Banknote, Truck
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { userRole, setUserRole, notifications, markNotificationsAsRead, totalPending } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [popupTop, setPopupTop] = useState(0);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setUserRole(null);
  };

  const handleNotificationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position it slightly adjusted if needed, but rect.top is exactly aligned with the button top
    setPopupTop(rect.top);
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, badge: totalPending > 0 ? totalPending : undefined },
    ...(userRole === 'admin' ? [{ name: 'Products', href: '/dashboard/inventory', icon: PackageSearch }] : []),
    { name: 'Customers', href: '/dashboard/consumer', icon: Users },
  ];

  const profilItems = [
    { name: 'Notifications', action: handleNotificationClick, icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  const renderLink = (item: any) => {
    const isActive = item.href && pathname === item.href;
    const Icon = item.icon;
    
    const content = (
      <>
        <div className="flex items-center gap-3">
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className={`text-[12px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm ${
            isActive ? 'bg-almirall-primary/10 text-almirall-primary' : 'bg-[#e4ebf5] text-[#002D54]'
          }`}>
            {item.badge}
          </span>
        )}
      </>
    );

    const className = `flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
      isActive 
        ? 'bg-white text-almirall-primary shadow-[0_8px_20px_rgba(255,255,255,0.2)]' 
        : 'text-gray-300 hover:bg-white hover:text-almirall-primary'
    }`;

    if (item.action) {
      return (
        <button key={item.name} onClick={item.action} className={className}>
          {content}
        </button>
      );
    }

    return (
      <Link key={item.name} href={item.href} className={className}>
        {content}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      <aside className={`w-[280px] flex-shrink-0 bg-almirall-primary flex flex-col shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-50 h-screen fixed lg:sticky top-0 overflow-y-auto custom-scrollbar transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Top Header */}
        <div className="px-6 pt-8 pb-4 mb-2 flex items-center justify-center w-full relative">
          <Image 
            src="/almirall-logo-white.svg" 
            alt="Almirall" 
            width={140} 
            height={42}  
            priority
            className="object-contain"
          />
          <button onClick={onClose} className="absolute right-4 p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors lg:hidden">
            <ChevronsLeft size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-6">
          {/* Menu Section */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 mb-2 px-2">General</h3>
            <nav className="flex flex-col gap-1">
              {menuItems.map(renderLink)}
            </nav>
          </div>

          {/* Profil Section */}
          <div className="relative">
            <h3 className="text-[11px] font-semibold text-gray-400 mb-2 px-2">Profil</h3>
            <nav className="flex flex-col gap-1">
              {profilItems.map(renderLink)}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-gray-300 hover:bg-white hover:text-red-500"
              >
                <LogOut size={18} strokeWidth={2} />
                <span>Log out</span>
              </button>
            </nav>

          </div>
        </div>

        {/* Bottom Profile */}
        <div className="p-4 mt-4 border-t border-white/10">
          <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
                {userRole === 'admin' ? 'FA' : 'MU'}
              </div>
              <div className="text-left text-white">
                <p className="text-sm font-bold leading-tight">
                  {userRole === 'admin' ? 'Ferra Alexandra' : 'Manager User'}
                </p>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  {userRole === 'admin' ? 'ferra.alexandra@almirall.com' : 'manager@almirall.com'}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>

      </aside>

      {/* Notifications Dropdown for Sidebar */}
      {showNotifications && (
        <div 
          className="fixed left-[296px] w-80 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 z-[100] overflow-hidden hidden lg:block"
          style={{ top: `${popupTop}px` }}
        >
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
    </>
  );
}
