'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-foreground">Himanshu</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Admin
            </Button>
          </Link>
          <Link href="/reception">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Reception
            </Button>
          </Link>
          <Link href="/doctor">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Doctor
            </Button>
          </Link>
          <Link href="/appointments">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Appointments
            </Button>
          </Link>
          <Link href="/queue-display">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Queue
            </Button>
          </Link>
        </div>

        <div className="flex gap-2">
          <Link href="/appointments" className="hidden sm:block">
            <Button size="sm" variant="outline" className="rounded-full px-6 text-sm border-border/50">
              Book
            </Button>
          </Link>
          <Link href="/patient-tracking">
            <Button size="sm" className="rounded-full px-6 text-sm font-medium">
              Track Status
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
