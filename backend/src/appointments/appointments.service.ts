import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Verify doctor exists
    await this.doctorsService.findById(createAppointmentDto.doctorId);

    // Check for appointment conflicts
    const appointmentDateTime = new Date(
      `${createAppointmentDto.appointmentDate}T${createAppointmentDto.appointmentTime}`
    );

    const conflictingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctorId: createAppointmentDto.doctorId,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        appointmentTime: createAppointmentDto.appointmentTime,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    if (conflictingAppointment) {
      throw new ConflictException('Doctor already has an appointment at this time');
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      appointmentDate: appointmentDateTime,
    });

    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findByDate(date: string): Promise<Appointment[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return await this.appointmentsRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      relations: ['doctor'],
      order: { appointmentTime: 'ASC' },
    });
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { doctorId },
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { status },
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findById(id);

    // If updating doctor, date, or time, check for conflicts
    if (
      updateAppointmentDto.doctorId ||
      updateAppointmentDto.appointmentDate ||
      updateAppointmentDto.appointmentTime
    ) {
      const doctorId = updateAppointmentDto.doctorId || appointment.doctorId;
      const appointmentDate = updateAppointmentDto.appointmentDate ? new Date(updateAppointmentDto.appointmentDate) : appointment.appointmentDate;
      const appointmentTime = updateAppointmentDto.appointmentTime || appointment.appointmentTime;

      const conflictingAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctorId,
          appointmentDate,
          appointmentTime,
          status: AppointmentStatus.SCHEDULED,
        },
      });

      if (conflictingAppointment && conflictingAppointment.id !== id) {
        throw new ConflictException('Doctor already has an appointment at this time');
      }
    }

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findById(id);
    appointment.status = status;
    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findById(id);
    await this.appointmentsRepository.remove(appointment);
  }

  async getTodaysAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.findByDate(today);
  }

  async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await this.appointmentsRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
        status: AppointmentStatus.SCHEDULED,
      },
      relations: ['doctor'],
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }
}
