import { Patient, Doctor, Appointment, User } from './types';

export const mockUser: User = {
  id: '1',
  username: 'frontdesk',
  email: 'frontdesk@clinic.com',
  role: 'front-desk',
  name: 'Sarah Johnson'
};

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiology',
    gender: 'male',
    location: 'Building A - Room 101',
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '13:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    isAvailable: true,
    currentPatientCount: 8,
    maxPatientsPerDay: 15,
    consultationFee: 150
  },
  {
    id: '2',
    name: 'Dr. Sarah Williams',
    specialization: 'Dermatology',
    gender: 'female',
    location: 'Building B - Room 205',
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' }
    ],
    isAvailable: true,
    currentPatientCount: 5,
    maxPatientsPerDay: 12,
    consultationFee: 120
  },
  {
    id: '3',
    name: 'Dr. James Rodriguez',
    specialization: 'Pediatrics',
    gender: 'male',
    location: 'Building A - Room 103',
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Friday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00' }
    ],
    isAvailable: false,
    currentPatientCount: 12,
    maxPatientsPerDay: 12,
    consultationFee: 140
  },
  {
    id: '4',
    name: 'Dr. Emily Thompson',
    specialization: 'General Practice',
    gender: 'female',
    location: 'Building A - Room 102',
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '18:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '18:00' },
      { day: 'Friday', startTime: '08:00', endTime: '18:00' }
    ],
    isAvailable: true,
    currentPatientCount: 6,
    maxPatientsPerDay: 20,
    consultationFee: 100
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john.smith@email.com',
    age: 45,
    gender: 'male',
    queueNumber: 1,
    status: 'waiting',
    priority: 'medium',
    arrivalTime: new Date('2024-01-15T09:00:00'),
    estimatedWaitTime: 15,
    symptoms: 'Chest pain'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    phone: '+1234567891',
    email: 'maria.garcia@email.com',
    age: 32,
    gender: 'female',
    queueNumber: 2,
    status: 'with-doctor',
    priority: 'high',
    arrivalTime: new Date('2024-01-15T09:15:00'),
    symptoms: 'Severe headache'
  },
  {
    id: '3',
    name: 'David Johnson',
    phone: '+1234567892',
    age: 28,
    gender: 'male',
    queueNumber: 3,
    status: 'waiting',
    priority: 'low',
    arrivalTime: new Date('2024-01-15T09:30:00'),
    estimatedWaitTime: 45,
    symptoms: 'Regular checkup'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    phone: '+1234567893',
    email: 'lisa.chen@email.com',
    age: 38,
    gender: 'female',
    queueNumber: 4,
    status: 'waiting',
    priority: 'medium',
    arrivalTime: new Date('2024-01-15T09:45:00'),
    estimatedWaitTime: 60,
    symptoms: 'Skin rash'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patient: mockPatients[0],
    doctor: mockDoctors[0],
    date: new Date('2024-01-16'),
    time: '10:00',
    duration: 30,
    status: 'booked',
    type: 'consultation',
    symptoms: 'Follow-up for chest pain'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    patient: mockPatients[1],
    doctor: mockDoctors[1],
    date: new Date('2024-01-16'),
    time: '14:00',
    duration: 45,
    status: 'booked',
    type: 'consultation',
    symptoms: 'Skin consultation'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '4',
    patient: mockPatients[2],
    doctor: mockDoctors[3],
    date: new Date('2024-01-15'),
    time: '15:30',
    duration: 30,
    status: 'completed',
    type: 'follow-up',
    notes: 'Patient feeling better'
  }
];