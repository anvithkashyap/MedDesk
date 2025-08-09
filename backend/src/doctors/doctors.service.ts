import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorSpecialty } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Check if doctor with same email or license number exists
    const existingDoctor = await this.doctorsRepository.findOne({
      where: [
        { email: createDoctorDto.email },
        { licenseNumber: createDoctorDto.licenseNumber },
      ],
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email or license number already exists');
    }

    const doctor = this.doctorsRepository.create(createDoctorDto);
    return await this.doctorsRepository.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      order: { lastName: 'ASC' },
    });
  }

  async findActive(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      where: { isActive: true },
      order: { lastName: 'ASC' },
    });
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['appointments'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async findBySpecialty(specialty: DoctorSpecialty): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      where: { specialty, isActive: true },
      order: { lastName: 'ASC' },
    });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findById(id);

    // Check for conflicts if email or license number is being updated
    if (updateDoctorDto.email || updateDoctorDto.licenseNumber) {
      const conflictConditions = [];
      if (updateDoctorDto.email) {
        conflictConditions.push({ email: updateDoctorDto.email });
      }
      if (updateDoctorDto.licenseNumber) {
        conflictConditions.push({ licenseNumber: updateDoctorDto.licenseNumber });
      }

      const existingDoctor = await this.doctorsRepository.findOne({
        where: conflictConditions,
      });

      if (existingDoctor && existingDoctor.id !== id) {
        throw new ConflictException('Doctor with this email or license number already exists');
      }
    }

    Object.assign(doctor, updateDoctorDto);
    return await this.doctorsRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findById(id);
    await this.doctorsRepository.remove(doctor);
  }

  async deactivate(id: string): Promise<Doctor> {
    const doctor = await this.findById(id);
    doctor.isActive = false;
    return await this.doctorsRepository.save(doctor);
  }

  async activate(id: string): Promise<Doctor> {
    const doctor = await this.findById(id);
    doctor.isActive = true;
    return await this.doctorsRepository.save(doctor);
  }
}
