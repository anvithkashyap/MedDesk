import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth';
import { DoctorsService } from '../services/doctors';
import { AppointmentsService } from '../services/appointments';
import { QueueService } from '../services/queue';
import { UserService } from '../services/user';
import { 
  LoginRequest, 
  RegisterRequest, 
  Doctor, 
  CreateDoctorRequest,
  CreateAppointmentRequest,
  CreateQueueItemRequest,
  DoctorSpecialty,
  AppointmentStatus,
  QueueStatus,
  Priority,
  CreateUserRequest,
  UpdateUserRequest
} from '../types/api';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => AuthService.getProfile(),
    enabled: AuthService.isAuthenticated(),
  });
};

// Doctors hooks
export const useDoctors = (params?: { active?: boolean; specialty?: DoctorSpecialty }) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => DoctorsService.getDoctors(params),
  });
};

export const useActiveDoctors = () => {
  return useQuery({
    queryKey: ['doctors', 'active'],
    queryFn: () => DoctorsService.getActiveDoctors(),
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => DoctorsService.getDoctorById(id),
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorData: CreateDoctorRequest) => DoctorsService.createDoctor(doctorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorRequest> }) => 
      DoctorsService.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DoctorsService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

// Appointments hooks
export const useAppointments = (params?: {
  date?: string;
  doctorId?: string;
  status?: AppointmentStatus;
}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => AppointmentsService.getAppointments(params),
  });
};

export const useTodaysAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => AppointmentsService.getTodaysAppointments(),
  });
};

export const useUpcomingAppointments = (days?: number) => {
  return useQuery({
    queryKey: ['appointments', 'upcoming', days],
    queryFn: () => AppointmentsService.getUpcomingAppointments(days),
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => AppointmentsService.getAppointmentById(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentData: CreateAppointmentRequest) => 
      AppointmentsService.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAppointmentRequest> }) => 
      AppointmentsService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) => 
      AppointmentsService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Queue hooks
export const useQueue = (params?: { doctorId?: string; status?: QueueStatus }) => {
  return useQuery({
    queryKey: ['queue', params],
    queryFn: () => QueueService.getQueueItems(params),
  });
};

export const useWaitingQueue = () => {
  return useQuery({
    queryKey: ['queue', 'waiting'],
    queryFn: () => QueueService.getWaitingQueue(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useQueueStats = (doctorId?: string) => {
  return useQuery({
    queryKey: ['queue', 'stats', doctorId],
    queryFn: () => QueueService.getQueueStats(doctorId),
    refetchInterval: 30000,
  });
};

export const useAddToQueue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (queueData: CreateQueueItemRequest) => QueueService.addToQueue(queueData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useCallNextPatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => QueueService.callNextPatient(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
};

export const useStartQueueItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QueueService.startQueueItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useCompleteQueueItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QueueService.completeQueueItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useUpdateQueuePriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: Priority }) => 
      QueueService.updateQueueItemPriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useRemoveFromQueue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QueueService.removeFromQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// User Management hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getAllUsers(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => UserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserRequest }) => 
      UserService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
