import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum DoctorSpecialty {
  GENERAL_PRACTICE = 'general_practice',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ENDOCRINOLOGY = 'endocrinology',
  GASTROENTEROLOGY = 'gastroenterology',
  NEUROLOGY = 'neurology',
  ONCOLOGY = 'oncology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  PSYCHIATRY = 'psychiatry',
  RADIOLOGY = 'radiology',
  SURGERY = 'surgery',
  UROLOGY = 'urology',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({
    type: 'enum',
    enum: DoctorSpecialty,
    default: DoctorSpecialty.GENERAL_PRACTICE,
  })
  specialty: DoctorSpecialty;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'json', nullable: true })
  workingHours: {
    [key: string]: { start: string; end: string; isWorking: boolean };
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `Dr. ${this.firstName} ${this.lastName}`;
  }
}
