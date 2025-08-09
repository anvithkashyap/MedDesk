"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  FileText,
  Edit,
  X,
  RotateCcw
} from 'lucide-react';
import { Appointment } from '@/lib/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onEdit: (appointmentId: string) => void;
}

export function AppointmentCard({ 
  appointment, 
  onReschedule, 
  onCancel, 
  onEdit 
}: AppointmentCardProps) {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-teal-100 text-teal-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
              <p className="text-sm text-gray-600">with {appointment.doctor.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={getTypeColor(appointment.type)}>
              {appointment.type.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{appointment.time} ({appointment.duration} min)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{appointment.doctor.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{appointment.doctor.specialization}</span>
          </div>
        </div>

        {appointment.symptoms && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Symptoms/Reason</h4>
            <p className="text-sm text-gray-600">{appointment.symptoms}</p>
          </div>
        )}

        {appointment.notes && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}

        {appointment.status === 'booked' && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(appointment.id)}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReschedule(appointment.id)}
              className="flex items-center space-x-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reschedule</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(appointment.id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}