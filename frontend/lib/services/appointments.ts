import { apiClient } from '../api-client';
import { Appointment, CreateAppointmentRequest, AppointmentStatus } from '../types/api';

export class AppointmentsService {
  // Get all appointments
  static async getAppointments(params?: {
    date?: string;
    doctorId?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments', { params });
    return response.data;
  }

  // Get today's appointments
  static async getTodaysAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments/today');
    return response.data;
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(days?: number): Promise<Appointment[]> {
    const params = days ? { days } : {};
    const response = await apiClient.get<Appointment[]>('/appointments/upcoming', { params });
    return response.data;
  }

  // Get appointments by date
  static async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(`/appointments?date=${date}`);
    return response.data;
  }

  // Get appointments by doctor
  static async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(`/appointments?doctorId=${doctorId}`);
    return response.data;
  }

  // Get appointment by ID
  static async getAppointmentById(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  // Create new appointment
  static async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', appointmentData);
    return response.data;
  }

  // Update appointment
  static async updateAppointment(id: string, appointmentData: Partial<CreateAppointmentRequest>): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, appointmentData);
    return response.data;
  }

  // Update appointment status
  static async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  }

  // Delete appointment
  static async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }
}
