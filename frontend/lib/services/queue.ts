import { apiClient } from '../api-client';
import { QueueItem, CreateQueueItemRequest, QueueStatus, Priority } from '../types/api';

export class QueueService {
  // Get all queue items
  static async getQueueItems(params?: {
    doctorId?: string;
    status?: QueueStatus;
  }): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>('/queue', { params });
    return response.data;
  }

  // Get waiting queue
  static async getWaitingQueue(): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>('/queue/waiting');
    return response.data;
  }

  // Get queue by doctor
  static async getQueueByDoctor(doctorId: string): Promise<QueueItem[]> {
    const response = await apiClient.get<QueueItem[]>(`/queue?doctorId=${doctorId}`);
    return response.data;
  }

  // Get queue statistics
  static async getQueueStats(doctorId?: string): Promise<{
    waiting: number;
    inProgress: number;
    completed: number;
    total: number;
    averageWaitTime: number;
  }> {
    const params = doctorId ? { doctorId } : {};
    const response = await apiClient.get('/queue/stats', { params });
    return response.data;
  }

  // Add patient to queue
  static async addToQueue(queueData: CreateQueueItemRequest): Promise<QueueItem> {
    const response = await apiClient.post<QueueItem>('/queue', queueData);
    return response.data;
  }

  // Call next patient
  static async callNextPatient(doctorId: string): Promise<QueueItem | null> {
    const response = await apiClient.post<QueueItem>(`/queue/call-next/${doctorId}`);
    return response.data;
  }

  // Get queue item by ID
  static async getQueueItemById(id: string): Promise<QueueItem> {
    const response = await apiClient.get<QueueItem>(`/queue/${id}`);
    return response.data;
  }

  // Update queue item
  static async updateQueueItem(id: string, queueData: Partial<CreateQueueItemRequest>): Promise<QueueItem> {
    const response = await apiClient.patch<QueueItem>(`/queue/${id}`, queueData);
    return response.data;
  }

  // Start queue item (set to in_progress)
  static async startQueueItem(id: string): Promise<QueueItem> {
    const response = await apiClient.patch<QueueItem>(`/queue/${id}/start`);
    return response.data;
  }

  // Complete queue item
  static async completeQueueItem(id: string): Promise<QueueItem> {
    const response = await apiClient.patch<QueueItem>(`/queue/${id}/complete`);
    return response.data;
  }

  // Skip queue item
  static async skipQueueItem(id: string): Promise<QueueItem> {
    const response = await apiClient.patch<QueueItem>(`/queue/${id}/skip`);
    return response.data;
  }

  // Update queue item priority
  static async updateQueueItemPriority(id: string, priority: Priority): Promise<QueueItem> {
    const response = await apiClient.patch<QueueItem>(`/queue/${id}/priority`, { priority });
    return response.data;
  }

  // Remove from queue
  static async removeFromQueue(id: string): Promise<void> {
    await apiClient.delete(`/queue/${id}`);
  }
}
