'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Users, Building2, LogOut, Zap, Truck, User, Brain, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/queue-analytics', label: 'Queue Analytics', icon: BarChart3 },
  { href: '/admin/queue-prediction-advanced', label: 'Predictions', icon: Brain },
  { href: '/admin/patient-messaging', label: 'Patient Notifications', icon: Mail },
  { href: '/admin/machines', label: 'Machines', icon: Zap },
  { href: '/admin/ambulances', label: 'Ambulances', icon: Truck },
  { href: '/admin/patient-history', label: 'Patient History', icon: User },
  { href: '/admin/manage-doctors', label: 'Doctors', icon: Users },
  { href: '/admin/manage-departments', label: 'Departments', icon: Building2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar overflow-y-auto pt-20">
      <div className="flex flex-col h-full">
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    isActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
