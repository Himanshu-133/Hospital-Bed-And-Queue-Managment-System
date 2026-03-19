'use client';

import { BookingForm } from '@/components/appointments/booking-form';
import { AppointmentsList } from '@/components/appointments/appointments-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Appointment Management</h1>
              <p className="text-muted-foreground">Book and manage your doctor appointments</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-border/50">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50">
            <TabsTrigger value="book" className="rounded-lg">Book Appointment</TabsTrigger>
            <TabsTrigger value="view" className="rounded-lg">View My Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="mt-8">
            <BookingForm />
          </TabsContent>

          <TabsContent value="view" className="mt-8">
            <AppointmentsList />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
