'use client';

import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQueue } from '@/lib/queue-context';
import { useState } from 'react';
import { Search, CheckCircle2, Clock, User, MapPin, Phone, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function PatientTracking() {
  const { patients } = useQueue();
  const [searchToken, setSearchToken] = useState('');
  const [searched, setSearc hed] = useState(false);

  const foundPatient = patients.find(p => p.token === searchToken.toUpperCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const getPositionInQueue = () => {
    if (!foundPatient) return null;
    const waitingBefore = patients.filter(
      p => p.status === 'waiting' && 
      new Date(p.timestamp) < new Date(foundPatient.timestamp) &&
      p.department === foundPatient.department
    ).length;
    return waitingBefore + 1;
  };

  const statusConfig = {
    'waiting': {
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      icon: Clock,
      title: 'Waiting in Queue',
      description: 'Your turn is coming up soon',
    },
    'in-consultation': {
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: User,
      title: 'In Consultation',
      description: 'Currently with the doctor',
    },
    'completed': {
      badge: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: CheckCircle2,
      title: 'Completed',
      description: 'Your consultation is complete',
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          {/* Search Card */}
          <Card className="border-border p-8 bg-card mb-8 shadow-lg">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Track Your Status</h1>
            <p className="mb-8 text-muted-foreground">Enter your token number to check your queue position</p>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                placeholder="Enter token (e.g., P-001, CD-005)"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value.toUpperCase())}
                className="border-border text-lg py-6"
              />
              <Button type="submit" size="lg" className="gap-2 bg-primary hover:bg-primary/90 px-8">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </form>

            {searched && !foundPatient && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
                <p className="text-destructive font-medium">Token not found</p>
                <p className="text-sm text-muted-foreground mt-1">Please check your token number and try again</p>
              </div>
            )}
          </Card>

          {/* Results */}
          {searched && foundPatient && (
            <div className="space-y-6 animate-in fade-in">
              {/* Main Status Card */}
              <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 border-2">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <Badge className={statusConfig[foundPatient.status].badge}>
                      {statusConfig[foundPatient.status].title}
                    </Badge>
                  </div>
                  {statusConfig[foundPatient.status].icon !== Clock && (
                    <div className="text-primary">
                      {statusConfig[foundPatient.status].icon && 
                        <statusConfig[foundPatient.status].icon className="h-6 w-6" />
                      }
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {foundPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{foundPatient.name}</h2>
                    <p className="text-lg font-mono font-semibold text-primary">{foundPatient.token}</p>
                  </div>
                </div>

                <p className="mb-6 text-muted-foreground text-center">
                  {statusConfig[foundPatient.status].description}
                </p>

                {/* Queue Position */}
                {foundPatient.status === 'waiting' && (
                  <div className="p-6 rounded-lg bg-white/50 dark:bg-white/5 text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Position in Queue</p>
                    <p className="text-5xl font-bold text-primary mb-2">{getPositionInQueue()}</p>
                    <p className="text-sm text-muted-foreground">
                      Estimated wait: {foundPatient.estimatedWait} minutes
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/50 dark:bg-white/5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Age</p>
                    <p className="font-semibold text-foreground">{foundPatient.age} years</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Department</p>
                    <p className="font-semibold text-foreground">{foundPatient.department}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Registered</p>
                    <p className="font-semibold text-foreground">
                      {new Date(foundPatient.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold text-foreground">{foundPatient.phone}</p>
                  </div>
                </div>
              </Card>

              {/* Info Card */}
              <Card className="border-border p-6 bg-card">
                <h3 className="mb-4 font-semibold text-card-foreground">Helpful Tips</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Keep your token with you and listen for announcements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Look at the queue display screen for your token number</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Staff will call your token - please be ready</span>
                  </li>
                </ul>
              </Card>

              {/* Auto Refresh */}
              <div className="text-center text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <span>Updates automatically every 30 seconds</span>
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!searched && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border p-6 bg-card text-center hover:border-primary/50 transition-colors">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-card-foreground mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">Get instant notifications about your position</p>
              </Card>
              <Card className="border-border p-6 bg-card text-center hover:border-secondary/50 transition-colors">
                <MapPin className="h-10 w-10 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-card-foreground mb-2">Easy to Find</h3>
                <p className="text-sm text-muted-foreground">Your token displays on the main queue screen</p>
              </Card>
              <Card className="border-border p-6 bg-card text-center hover:border-accent/50 transition-colors">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-card-foreground mb-2">Always Connected</h3>
                <p className="text-sm text-muted-foreground">Check status anytime from your phone</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
