"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  User, 
  Phone, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Patient } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QueueCardProps {
  patient: Patient;
  onStatusUpdate: (patientId: string, status: Patient['status']) => void;
  onPriorityUpdate: (patientId: string, priority: Patient['priority']) => void;
}

export function QueueCard({ patient, onStatusUpdate, onPriorityUpdate }: QueueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'with-doctor': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Patient['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${getPriorityColor(patient.priority)} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold text-lg">
              {patient.queueNumber}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Age {patient.age} • {patient.gender}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(patient.status)}>
              {patient.status.replace('-', ' ').toUpperCase()}
            </Badge>
            {patient.priority === 'high' && (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Arrived: {formatTime(patient.arrivalTime)}</span>
          </div>
          {patient.estimatedWaitTime && (
            <div className="flex items-center space-x-1">
              <span>Est. wait:</span>
              <Badge variant="outline">{patient.estimatedWaitTime} min</Badge>
            </div>
          )}
        </div>

        {patient.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Phone className="h-4 w-4" />
            <span>{patient.phone}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 p-0 h-auto"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                More
              </>
            )}
          </Button>
          
          <div className="flex space-x-2">
            {patient.status !== 'completed' && patient.status !== 'cancelled' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(patient.id, patient.status === 'waiting' ? 'with-doctor' : 'completed')}
                  className="flex items-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{patient.status === 'waiting' ? 'Start' : 'Complete'}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate(patient.id, 'cancelled')}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {patient.symptoms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Symptoms</h4>
                <p className="text-sm text-gray-600">{patient.symptoms}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  value={patient.priority}
                  onValueChange={(value: Patient['priority']) => 
                    onPriorityUpdate(patient.id, value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={patient.status}
                  onValueChange={(value: Patient['status']) => 
                    onStatusUpdate(patient.id, value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="with-doctor">With Doctor</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}