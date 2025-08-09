// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'receptionist' | 'nurse';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Doctor types
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialty: DoctorSpecialty;
  phone: string;
  isActive: boolean;
  bio?: string;
  workingHours?: WorkingHours;
  consultationFee?: number;
  createdAt: string;
  updatedAt: string;
}

export type DoctorSpecialty = 
  | 'general_practice'
  | 'cardiology'
  | 'dermatology'
  | 'endocrinology'
  | 'gastroenterology'
  | 'neurology'
  | 'oncology'
  | 'orthopedics'
  | 'pediatrics'
  | 'psychiatry'
  | 'radiology'
  | 'surgery'
  | 'urology';

export interface WorkingHours {
  [key: string]: {
    start: string;
    end: string;
    isWorking: boolean;
  };
}

// Appointment types
export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAddress?: string;
  dateOfBirth: string;
  appointmentDate: string;
  appointmentTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  fee?: number;
  isPaid: boolean;
  doctor: Doctor;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 
  | 'consultation'
  | 'follow_up'
  | 'emergency'
  | 'routine_checkup'
  | 'procedure';

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

// Queue types
export interface QueueItem {
  id: string;
  queueNumber: number;
  patientName: string;
  status: QueueStatus;
  priority: Priority;
  estimatedWaitTime?: number;
  checkedInAt?: string;
  calledAt?: string;
  completedAt?: string;
  appointment?: Appointment;
  appointmentId?: string;
  doctor: Doctor;
  doctorId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type QueueStatus = 
  | 'waiting'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type Priority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'receptionist' | 'nurse';
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'receptionist' | 'nurse';
  phone?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'receptionist' | 'nurse';
  phone?: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    fullName: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Create/Update DTOs
export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialty: DoctorSpecialty;
  phone: string;
  bio?: string;
  workingHours?: WorkingHours;
  consultationFee?: number;
}

export interface CreateAppointmentRequest {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAddress?: string;
  dateOfBirth: string;
  appointmentDate: string;
  appointmentTime: string;
  type?: AppointmentType;
  reason?: string;
  notes?: string;
  fee?: number;
  doctorId: string;
}

export interface CreateQueueItemRequest {
  patientName: string;
  priority?: Priority;
  estimatedWaitTime?: number;
  appointmentId?: string;
  doctorId: string;
  notes?: string;
}
