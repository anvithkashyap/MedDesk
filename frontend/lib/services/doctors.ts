import { apiClient } from '../api-client';
import { Doctor, CreateDoctorRequest, DoctorSpecialty } from '../types/api';

export class DoctorsService {
  // Get all doctors
  static async getDoctors(params?: {
    active?: boolean;
    specialty?: DoctorSpecialty;
  }): Promise<Doctor[]> {
    const response = await apiClient.get<Doctor[]>('/doctors', { params });
    return response.data;
  }

  // Get active doctors only
  static async getActiveDoctors(): Promise<Doctor[]> {
    const response = await apiClient.get<Doctor[]>('/doctors?active=true');
    return response.data;
  }

  // Get doctors by specialty
  static async getDoctorsBySpecialty(specialty: DoctorSpecialty): Promise<Doctor[]> {
    const response = await apiClient.get<Doctor[]>(`/doctors?specialty=${specialty}`);
    return response.data;
  }

  // Get doctor by ID
  static async getDoctorById(id: string): Promise<Doctor> {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  }

  // Create new doctor
  static async createDoctor(doctorData: CreateDoctorRequest): Promise<Doctor> {
    const response = await apiClient.post<Doctor>('/doctors', doctorData);
    return response.data;
  }

  // Update doctor
  static async updateDoctor(id: string, doctorData: Partial<CreateDoctorRequest>): Promise<Doctor> {
    const response = await apiClient.patch<Doctor>(`/doctors/${id}`, doctorData);
    return response.data;
  }

  // Deactivate doctor
  static async deactivateDoctor(id: string): Promise<Doctor> {
    const response = await apiClient.patch<Doctor>(`/doctors/${id}/deactivate`);
    return response.data;
  }

  // Activate doctor
  static async activateDoctor(id: string): Promise<Doctor> {
    const response = await apiClient.patch<Doctor>(`/doctors/${id}/activate`);
    return response.data;
  }

  // Delete doctor
  static async deleteDoctor(id: string): Promise<void> {
    await apiClient.delete(`/doctors/${id}`);
  }
}
