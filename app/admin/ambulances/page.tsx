'use client';

import { useQueue } from '@/lib/queue-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, AlertTriangle, Truck, MapPin, Clock } from 'lucide-react';

export default function AmbulancesPage() {
  const { ambulances, updateAmbulanceLocation } = useQueue();

  const statusIcons: Record<string, React.ReactNode> = {
    available: <Truck className="h-5 w-5 text-green-500" />,
    'in-transit': <Navigation className="h-5 w-5 text-blue-500" />,
    'at-hospital': <MapPin className="h-5 w-5 text-yellow-500" />,
    maintenance: <AlertTriangle className="h-5 w-5 text-red-500" />,
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-500/20 text-green-400',
    'in-transit': 'bg-blue-500/20 text-blue-400',
    'at-hospital': 'bg-yellow-500/20 text-yellow-400',
    maintenance: 'bg-red-500/20 text-red-400',
  };

  const availableAmbulances = ambulances.filter(a => a.status === 'available').length;
  const inTransit = ambulances.filter(a => a.status === 'in-transit').length;
  const atHospital = ambulances.filter(a => a.status === 'at-hospital').length;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Ambulance Fleet Management</h1>
          <p className="text-muted-foreground">Real-time ambulance tracking and dispatch</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available</p>
                <p className="text-3xl font-bold text-green-400">{availableAmbulances}</p>
              </div>
              <Truck className="h-10 w-10 text-green-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Transit</p>
                <p className="text-3xl font-bold text-blue-400">{inTransit}</p>
              </div>
              <Navigation className="h-10 w-10 text-blue-500/30" />
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-card/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">At Hospital</p>
                <p className="text-3xl font-bold text-yellow-400">{atHospital}</p>
              </div>
              <MapPin className="h-10 w-10 text-yellow-500/30" />
            </div>
          </Card>
        </div>

        {/* Ambulances Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Fleet Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ambulances.map(ambulance => (
              <Card key={ambulance.id} className="p-6 border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{ambulance.vehicleNumber}</h3>
                    <p className="text-sm text-muted-foreground">Driver: {ambulance.driver}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcons[ambulance.status]}
                    <Badge className={`${statusColors[ambulance.status]} border-0`}>
                      {ambulance.status}
                    </Badge>
                  </div>
                </div>

                {/* Location Info */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mb-4">
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground text-sm">
                        {ambulance.location.lat.toFixed(4)}, {ambulance.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  {ambulance.responseTime > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Response Time</p>
                        <p className="font-semibold text-foreground text-sm">{ambulance.responseTime} minutes</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Patient */}
                {ambulance.currentPatient && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Transporting Patient</p>
                    <p className="text-sm font-semibold text-foreground">ID: {ambulance.currentPatient}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  {ambulance.status === 'available' && (
                    <Button
                      size="sm"
                      className="flex-1 rounded-lg"
                      onClick={() => updateAmbulanceLocation(ambulance.id, 30.0500, 31.2450)}
                    >
                      Dispatch
                    </Button>
                  )}
                  {ambulance.status === 'in-transit' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50"
                      onClick={() => updateAmbulanceLocation(ambulance.id, 30.0444, 31.2357)}
                    >
                      Arrived at Hospital
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12">
          <Card className="p-8 border-border/50 bg-card/30">
            <h3 className="text-xl font-bold text-foreground mb-4">Live Fleet Map</h3>
            <div className="w-full h-96 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">Live map integration coming soon</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
