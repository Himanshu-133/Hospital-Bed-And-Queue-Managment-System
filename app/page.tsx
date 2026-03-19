'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Activity, Zap, Stethoscope } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Minimalist Black Aesthetic */}
      <section className="relative overflow-hidden px-4 py-40 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="mb-12 space-y-8">
            <div className="text-sm tracking-widest uppercase text-muted-foreground/70 mb-6">Healthcare Intelligence</div>
            <h1 className="text-7xl lg:text-8xl font-bold leading-tight text-foreground text-balance">
              Queue<br />Management<br />Elevated
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              A modern hospital queue system built for efficiency. Real-time tracking, intelligent routing, and seamless patient experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/admin">
                <Button size="lg" className="gap-2 rounded-full px-8">
                  Explore Admin <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/queue-display">
                <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 border-foreground/20">
                  View Display
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-6 p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live queue updates across all departments. Monitor patient flow with precision analytics.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-6 p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Smart Allocation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intelligent patient routing based on doctor availability and specialization.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-6 p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Patient-Centric</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Self-service tracking, accurate wait estimates, and seamless notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Minimal Design */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-primary">1000+</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">Patients Daily</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-primary">50%</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">Faster Queues</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-primary">99.9%</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">Uptime</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold text-primary">Real-time</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">Analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-balance">
            Built for every role in your hospital
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/reception" className="group">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">Reception</h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground">
                  Register patients, issue tokens, and manage daily operations efficiently
                </p>
              </div>
            </Link>

            <Link href="/doctor" className="group">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">Doctors</h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground">
                  View your patient queue, manage appointments, and optimize your schedule
                </p>
              </div>
            </Link>

            <Link href="/admin" className="group">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">Administration</h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground">
                  Monitor operations, analyze performance, and make data-driven decisions
                </p>
              </div>
            </Link>

            <Link href="/patient-tracking" className="group">
              <div className="p-8 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">Patients</h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground">
                  Track your position, check wait times, and receive real-time updates
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Transform your hospital operations
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Join modern healthcare facilities using intelligent queue management.
          </p>
          <Link href="/admin">
            <Button size="lg" className="rounded-full px-8">
              Start Exploring
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 HancGenX. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
