"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
  ];

  return (
    <aside className={`bg-base-100 h-full transition-all duration-300 ${
      sidebarOpen ? 'w-64' : 'w-0 md:w-16'
    } shadow-lg`}>
      <div className="h-full flex flex-col py-4">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-content' 
                    : 'text-base-content hover:bg-base-200'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 mt-6">
          <Link
            href="/login"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-base-content hover:bg-base-200"
          >
            <LogOut className={`mr-3 h-5 w-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}