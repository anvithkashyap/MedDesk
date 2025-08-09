export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  queueNumber?: number;
  status: 'waiting' | 'with-doctor' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  arrivalTime: Date;
  estimatedWaitTime?: number;
  symptoms?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female';
  location: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  isAvailable: boolean;
  currentPatientCount: number;
  maxPatientsPerDay: number;
  consultationFee: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  time: string;
  duration: number;
  status: 'booked' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  symptoms?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'front-desk' | 'admin';
  name: string;
}