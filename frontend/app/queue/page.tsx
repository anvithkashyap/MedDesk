"use client";

import { useState } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Play, 
  Trash2,
  Loader2,
  Phone,
  Users,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { 
  useQueue, 
  useAddToQueue, 
  useStartQueueItem,
  useCompleteQueueItem,
  useUpdateQueuePriority,
  useRemoveFromQueue,
  useActiveDoctors 
} from '@/lib/hooks/use-api';
import { QueueStatus, Priority } from '@/lib/types/api';
import { toast } from 'sonner';

function QueuePageContent() {
  const { user } = useAuth();
  const { data: queueItems = [], isLoading, refetch } = useQueue();
  const { data: doctors = [] } = useActiveDoctors();
  const addToQueue = useAddToQueue();
  const startQueueItem = useStartQueueItem();
  const completeQueueItem = useCompleteQueueItem();
  const updatePriority = useUpdateQueuePriority();
  const removeFromQueue = useRemoveFromQueue();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    notes: '',
    priority: 'normal' as Priority,
    doctorId: '',
    estimatedWaitTime: 30
  });

  const handleStartPatient = async (id: string) => {
    try {
      await startQueueItem.mutateAsync(id);
      toast.success('Patient started successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to start patient');
    }
  };

  const handleCompletePatient = async (id: string) => {
    try {
      await completeQueueItem.mutateAsync(id);
      toast.success('Patient completed successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to complete patient');
    }
  };

  const handleRemovePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this patient from the queue?')) {
      try {
        await removeFromQueue.mutateAsync(id);
        toast.success('Patient removed from queue');
        refetch();
      } catch (error) {
        toast.error('Failed to remove patient');
      }
    }
  };

  const handleUpdatePriority = async (id: string, priority: Priority) => {
    try {
      await updatePriority.mutateAsync({ id, priority });
      toast.success('Priority updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update priority');
    }
  };

  const handleAddPatient = async () => {
    if (!newPatient.patientName || !newPatient.notes || !newPatient.doctorId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addToQueue.mutateAsync({
        patientName: newPatient.patientName,
        notes: newPatient.notes,
        priority: newPatient.priority,
        doctorId: newPatient.doctorId,
        estimatedWaitTime: newPatient.estimatedWaitTime
      });
      
      toast.success('Patient added to queue successfully');
      setNewPatient({
        patientName: '',
        notes: '',
        priority: 'normal' as Priority,
        doctorId: '',
        estimatedWaitTime: 30
      });
      setIsAddPatientOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to add patient to queue');
    }
  };

  const filteredQueueItems = queueItems.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const queueStats = {
    totalPatients: queueItems.length,
    waiting: queueItems.filter(item => item.status === 'waiting').length,
    inProgress: queueItems.filter(item => item.status === 'in_progress').length,
    completed: queueItems.filter(item => item.status === 'completed').length,
    avgWaitTime: Math.round(queueItems.reduce((acc, item) => acc + (item.estimatedWaitTime || 0), 0) / queueItems.length) || 0
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-200 text-red-900';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: QueueStatus) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="mt-2 text-gray-600">Manage patient queue and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{queueStats.waiting}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{queueStats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{queueStats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStats.avgWaitTime}m</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Patient to Queue</DialogTitle>
                <DialogDescription>
                  Add a new patient to the waiting queue
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={newPatient.patientName}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Reason for Visit</Label>
                  <Textarea
                    id="notes"
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter reason for visit"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={newPatient.doctorId}
                    onValueChange={(value) => setNewPatient(prev => ({ ...prev, doctorId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newPatient.priority}
                    onValueChange={(value) => setNewPatient(prev => ({ ...prev, priority: value as Priority }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="waitTime">Estimated Wait Time (minutes)</Label>
                  <Input
                    id="waitTime"
                    type="number"
                    value={newPatient.estimatedWaitTime}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, estimatedWaitTime: parseInt(e.target.value) || 30 }))}
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient} disabled={addToQueue.isPending}>
                  {addToQueue.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add to Queue'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Queue Items */}
        <div className="grid gap-4">
          {filteredQueueItems.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
                  <p className="text-gray-500">Add patients to the queue to get started.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQueueItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">#{item.queueNumber}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">{item.patientName}</h3>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.notes || 'No reason specified'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Dr. {item.doctor?.firstName} {item.doctor?.lastName}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.estimatedWaitTime}m wait
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === 'waiting' && (
                        <>
                          <Select
                            value={item.priority}
                            onValueChange={(value) => handleUpdatePriority(item.id, value as Priority)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => handleStartPatient(item.id)}
                            disabled={startQueueItem.isPending}
                            size="sm"
                            variant="outline"
                          >
                            {startQueueItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      {item.status === 'in_progress' && (
                        <>
                          <Button
                            onClick={() => handleCompletePatient(item.id)}
                            disabled={completeQueueItem.isPending}
                            size="sm"
                          >
                            {completeQueueItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleRemovePatient(item.id)}
                            disabled={removeFromQueue.isPending}
                            size="sm"
                            variant="destructive"
                          >
                            {removeFromQueue.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                      {(item.status === 'waiting' || item.status === 'completed') && (
                        <Button
                          onClick={() => handleRemovePatient(item.id)}
                          disabled={removeFromQueue.isPending}
                          size="sm"
                          variant="outline"
                        >
                          {removeFromQueue.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function QueuePage() {
  return (
    <ProtectedRoute>
      <QueuePageContent />
    </ProtectedRoute>
  );
}
