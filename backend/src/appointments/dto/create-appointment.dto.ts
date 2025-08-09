import { IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDateString, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  @IsEmail()
  @IsNotEmpty()
  patientEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  patientPhone: string;

  @ApiProperty({ example: '123 Main St, City, State 12345', required: false })
  @IsOptional()
  patientAddress?: string;

  @ApiProperty({ example: '1990-01-15' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: '14:30' })
  @IsNotEmpty()
  appointmentTime: string;

  @ApiProperty({ enum: AppointmentType, example: AppointmentType.CONSULTATION })
  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;

  @ApiProperty({ example: 'Regular checkup' })
  @IsOptional()
  reason?: string;

  @ApiProperty({ example: 'Patient has history of hypertension', required: false })
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  fee?: number;

  @ApiProperty({ example: 'doctor-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;
}
