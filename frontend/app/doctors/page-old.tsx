"use client";

import { useState } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  UserCheck,
  Users,
  Mail,
  Phone,
  Trash2
} from 'lucide-react';
import { Doctor } from '@/lib/types/api';
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
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/contexts/auth-context';
import { useDoctors, useCreateDoctor, useDeleteDoctor } from '@/lib/hooks/use-api';
import { toast } from 'sonner';

export default function DoctorsPage() {
  const { user } = useAuth();
  const { data: doctors = [], isLoading, refetch } = useDoctors();
  const createDoctorMutation = useCreateDoctor();
  const deleteDoctorMutation = useDeleteDoctor();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: 'general_practice' as const,
    licenseNumber: '',
    consultationFee: 0
  });

  const handleEdit = (doctorId: string) => {
    console.log('Edit doctor:', doctorId);
  };

  const handleDelete = async (doctorId: string) => {
    try {
      await deleteDoctorMutation.mutateAsync(doctorId);
      toast.success('Doctor deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleAddDoctor = async () => {
    try {
      await createDoctorMutation.mutateAsync(newDoctor);
      toast.success('Doctor added successfully');
      setNewDoctor({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialty: 'general_practice' as const,
        licenseNumber: '',
        consultationFee: 0
      });
      setIsAddDoctorOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to add doctor');
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    console.log('Book appointment with doctor:', doctorId);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const activeDoctors = doctors.filter(d => d.isActive).length;
  const totalDoctors = doctors.length;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading doctors...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-2xl font-bold text-blue-600">{activeDoctors}</div>
            <p className="text-xs text-muted-foreground">Active Doctors</p>
          </div>
          <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Doctor</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Add a new doctor profile to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctor-firstName">First Name</Label>
                  <Input
                    id="doctor-firstName"
                    value={newDoctor.firstName}
                    onChange={(e) => setNewDoctor({...newDoctor, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-lastName">Last Name</Label>
                  <Input
                    id="doctor-lastName"
                    value={newDoctor.lastName}
                    onChange={(e) => setNewDoctor({...newDoctor, lastName: e.target.value})}
                    placeholder="Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    placeholder="john.smith@hospital.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-phone">Phone</Label>
                  <Input
                    id="doctor-phone"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={newDoctor.specialization}
                      onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                      placeholder="Cardiology"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-license">License Number</Label>
                    <Input
                      id="doctor-license"
                      value={newDoctor.licenseNumber}
                      onChange={(e) => setNewDoctor({...newDoctor, licenseNumber: e.target.value})}
                      placeholder="MD12345"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-experience">Experience (years)</Label>
                  <Input
                    id="doctor-experience"
                    type="number"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({...newDoctor, experience: parseInt(e.target.value) || 0})}
                    placeholder="5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultation-fee">Consultation Fee ($)</Label>
                    <Input
                      id="consultation-fee"
                      type="number"
                      value={newDoctor.consultationFee}
                      onChange={(e) => setNewDoctor({...newDoctor, consultationFee: parseFloat(e.target.value) || 0})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="working-hours-start">Working Hours Start</Label>
                    <Input
                      id="working-hours-start"
                      type="time"
                      value={newDoctor.workingHours.start}
                      onChange={(e) => setNewDoctor({...newDoctor, workingHours: {...newDoctor.workingHours, start: e.target.value}})}
                      placeholder="09:00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="working-hours-end">Working Hours End</Label>
                    <Input
                      id="working-hours-end"
                      type="time"
                      value={newDoctor.workingHours.end}
                      onChange={(e) => setNewDoctor({...newDoctor, workingHours: {...newDoctor.workingHours, end: e.target.value}})}
                      placeholder="17:00"
                    />
                  </div>
                </div>
                <Button onClick={handleAddDoctor} className="w-full">
                  Add Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Doctor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{doctorStats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{doctorStats.available}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unavailable</p>
                  <p className="text-2xl font-bold text-red-600">{doctorStats.unavailable}</p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Specializations</p>
                  <p className="text-2xl font-bold text-purple-600">{doctorStats.specializations}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search doctors by name, specialization, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec.toLowerCase()}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBookAppointment={handleBookAppointment}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500">
                {searchTerm || specializationFilter !== 'all' || availabilityFilter !== 'all'
                  ? 'Try adjusting your search or filters' 
                  : 'Add your first doctor profile to get started'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}