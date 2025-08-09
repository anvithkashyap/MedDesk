"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  UserCheck,
  CalendarDays,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/contexts/auth-context';
import { 
  useTodaysAppointments, 
  useUpcomingAppointments,
  useActiveDoctors,
  useWaitingQueue,
  useQueueStats
} from '@/lib/hooks/use-api';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: todaysAppointments = [], isLoading: appointmentsLoading } = useTodaysAppointments();
  const { data: upcomingAppointments = [], isLoading: upcomingLoading } = useUpcomingAppointments(7);
  const { data: doctors = [], isLoading: doctorsLoading } = useActiveDoctors();
  const { data: waitingQueue = [], isLoading: queueLoading } = useWaitingQueue();
  const { data: queueStats, isLoading: statsLoading } = useQueueStats();

  const stats = {
    totalPatientsToday: todaysAppointments.length,
    waitingPatients: queueStats?.waiting || 0,
    todayAppointments: todaysAppointments.length,
    availableDoctors: doctors.length,
    averageWaitTime: queueStats?.averageWaitTime || 0,
    completedToday: queueStats?.completed || 0
  };

  const recentPatients = waitingQueue.slice(0, 5);
  const nextAppointments = upcomingAppointments.filter(apt => 
    apt.status === 'scheduled'
  ).slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.firstName} {user?.lastName}. Here's what's happening at the clinic today.
            </p>
          </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatientsToday}</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Queue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waitingPatients}</div>
              <p className="text-xs text-muted-foreground">
                Avg wait: {stats.averageWaitTime} min
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableDoctors}</div>
              <p className="text-xs text-muted-foreground">
                Currently available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/queue" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Add Walk-in Patient
                </Button>
              </Link>
              <Link href="/appointments" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/doctors" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Doctors
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest patients in queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((queueItem) => (
                  <div key={queueItem.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{queueItem.patientName}</p>
                      <p className="text-xs text-gray-500">Queue #{queueItem.queueNumber}</p>
                    </div>
                    <Badge 
                      className={
                        queueItem.status === 'waiting' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : queueItem.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : queueItem.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {queueItem.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{appointment.patientName}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.appointmentTime} with {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {appointment.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Today's Activity Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                <p className="text-sm text-gray-600">Completed Consultations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.waitingPatients}</div>
                <p className="text-sm text-gray-600">Patients Waiting</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.averageWaitTime} min</div>
                <p className="text-sm text-gray-600">Average Wait Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  );
}