"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { Doctor } from '@/lib/types';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctorId: string) => void;
  onDelete: (doctorId: string) => void;
  onBookAppointment: (doctorId: string) => void;
}

export function DoctorCard({ 
  doctor, 
  onEdit, 
  onDelete, 
  onBookAppointment 
}: DoctorCardProps) {
  const getAvailabilityStatus = () => {
    if (!doctor.isAvailable) return 'Unavailable';
    if (doctor.currentPatientCount >= doctor.maxPatientsPerDay) return 'Fully Booked';
    return 'Available';
  };

  const getAvailabilityColor = () => {
    const status = getAvailabilityStatus();
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Fully Booked': return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </div>
          </div>
          <Badge className={getAvailabilityColor()}>
            {getAvailabilityStatus()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{doctor.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {doctor.currentPatientCount}/{doctor.maxPatientsPerDay} patients today
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>${doctor.consultationFee} consultation fee</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Availability
          </h4>
          <div className="space-y-1">
            {doctor.availability.slice(0, 3).map((slot, index) => (
              <div key={index} className="text-sm text-gray-600">
                <span className="font-medium">{slot.day}:</span> {slot.startTime} - {slot.endTime}
              </div>
            ))}
            {doctor.availability.length > 3 && (
              <p className="text-xs text-gray-500">+{doctor.availability.length - 3} more days</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(doctor.id)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(doctor.id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
          
          <Button
            size="sm"
            onClick={() => onBookAppointment(doctor.id)}
            disabled={!doctor.isAvailable || doctor.currentPatientCount >= doctor.maxPatientsPerDay}
            className="flex items-center space-x-1"
          >
            <Calendar className="h-4 w-4" />
            <span>Book</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}