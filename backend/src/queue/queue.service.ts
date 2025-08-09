import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueItem, QueueStatus, Priority } from './entities/queue-item.entity';
import { CreateQueueItemDto } from './dto/create-queue-item.dto';
import { UpdateQueueItemDto } from './dto/update-queue-item.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueItem)
    private queueRepository: Repository<QueueItem>,
    private appointmentsService: AppointmentsService,
    private doctorsService: DoctorsService,
  ) {}

  async create(createQueueItemDto: CreateQueueItemDto): Promise<QueueItem> {
    // Verify doctor exists
    await this.doctorsService.findById(createQueueItemDto.doctorId);

    // If appointment ID provided, verify it exists
    if (createQueueItemDto.appointmentId) {
      await this.appointmentsService.findById(createQueueItemDto.appointmentId);
    }

    // Generate queue number
    const queueNumber = await this.generateQueueNumber(createQueueItemDto.doctorId);

    const queueItem = this.queueRepository.create({
      ...createQueueItemDto,
      queueNumber,
      checkedInAt: new Date(),
    });

    return await this.queueRepository.save(queueItem);
  }

  async findAll(): Promise<QueueItem[]> {
    return await this.queueRepository.find({
      relations: ['doctor', 'appointment'],
      order: { queueNumber: 'ASC' },
    });
  }

  async findByDoctor(doctorId: string): Promise<QueueItem[]> {
    return await this.queueRepository.find({
      where: { doctorId },
      relations: ['doctor', 'appointment'],
      order: { queueNumber: 'ASC' },
    });
  }

  async findByStatus(status: QueueStatus): Promise<QueueItem[]> {
    return await this.queueRepository.find({
      where: { status },
      relations: ['doctor', 'appointment'],
      order: { priority: 'DESC', queueNumber: 'ASC' },
    });
  }

  async findWaitingQueue(): Promise<QueueItem[]> {
    return await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      relations: ['doctor', 'appointment'],
      order: { priority: 'DESC', queueNumber: 'ASC' },
    });
  }

  async findById(id: string): Promise<QueueItem> {
    const queueItem = await this.queueRepository.findOne({
      where: { id },
      relations: ['doctor', 'appointment'],
    });

    if (!queueItem) {
      throw new NotFoundException(`Queue item with ID ${id} not found`);
    }

    return queueItem;
  }

  async update(id: string, updateQueueItemDto: UpdateQueueItemDto): Promise<QueueItem> {
    const queueItem = await this.findById(id);
    Object.assign(queueItem, updateQueueItemDto);
    return await this.queueRepository.save(queueItem);
  }

  async callNext(doctorId: string): Promise<QueueItem | null> {
    const nextInQueue = await this.queueRepository.findOne({
      where: {
        doctorId,
        status: QueueStatus.WAITING,
      },
      relations: ['doctor', 'appointment'],
      order: { priority: 'DESC', queueNumber: 'ASC' },
    });

    if (!nextInQueue) {
      return null;
    }

    nextInQueue.status = QueueStatus.IN_PROGRESS;
    nextInQueue.calledAt = new Date();

    return await this.queueRepository.save(nextInQueue);
  }

  async startItem(id: string): Promise<QueueItem> {
    const queueItem = await this.findById(id);
    queueItem.status = QueueStatus.IN_PROGRESS;
    queueItem.calledAt = new Date();
    return await this.queueRepository.save(queueItem);
  }

  async completeItem(id: string): Promise<QueueItem> {
    const queueItem = await this.findById(id);
    queueItem.status = QueueStatus.COMPLETED;
    queueItem.completedAt = new Date();
    return await this.queueRepository.save(queueItem);
  }

  async skipItem(id: string): Promise<QueueItem> {
    const queueItem = await this.findById(id);
    queueItem.status = QueueStatus.SKIPPED;
    return await this.queueRepository.save(queueItem);
  }

  async updatePriority(id: string, priority: Priority): Promise<QueueItem> {
    const queueItem = await this.findById(id);
    queueItem.priority = priority;
    return await this.queueRepository.save(queueItem);
  }

  async remove(id: string): Promise<void> {
    const queueItem = await this.findById(id);
    await this.queueRepository.remove(queueItem);
  }

  async getQueueStats(doctorId?: string) {
    const whereCondition = doctorId ? { doctorId } : {};

    const [waiting, inProgress, completed] = await Promise.all([
      this.queueRepository.count({
        where: { ...whereCondition, status: QueueStatus.WAITING },
      }),
      this.queueRepository.count({
        where: { ...whereCondition, status: QueueStatus.IN_PROGRESS },
      }),
      this.queueRepository.count({
        where: { ...whereCondition, status: QueueStatus.COMPLETED },
      }),
    ]);

    const averageWaitTime = await this.calculateAverageWaitTime(doctorId);

    return {
      waiting,
      inProgress,
      completed,
      total: waiting + inProgress + completed,
      averageWaitTime,
    };
  }

  private async generateQueueNumber(doctorId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastQueueItem = await this.queueRepository.findOne({
      where: {
        doctorId,
        createdAt: Between(today, tomorrow),
      },
      order: { queueNumber: 'DESC' },
    });

    return lastQueueItem ? lastQueueItem.queueNumber + 1 : 1;
  }

  private async calculateAverageWaitTime(doctorId?: string): Promise<number> {
    const whereCondition = doctorId ? { doctorId } : {};

    const completedItems = await this.queueRepository.find({
      where: {
        ...whereCondition,
        status: QueueStatus.COMPLETED,
        calledAt: Not(IsNull()),
        checkedInAt: Not(IsNull()),
      },
      select: ['checkedInAt', 'calledAt'],
    });

    if (completedItems.length === 0) return 0;

    const totalWaitTime = completedItems.reduce((sum, item) => {
      const waitTime = item.calledAt.getTime() - item.checkedInAt.getTime();
      return sum + waitTime;
    }, 0);

    return Math.floor(totalWaitTime / completedItems.length / (1000 * 60)); // Convert to minutes
  }
}

// Import missing TypeORM operators
import { Between, Not, IsNull } from 'typeorm';
