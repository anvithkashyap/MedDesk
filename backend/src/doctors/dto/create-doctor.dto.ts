import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DoctorSpecialty } from '../entities/doctor.entity';

export class CreateDoctorDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'dr.smith@meddesk.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MD123456' })
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ enum: DoctorSpecialty, example: DoctorSpecialty.GENERAL_PRACTICE })
  @IsEnum(DoctorSpecialty)
  specialty: DoctorSpecialty;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Experienced general practitioner with 10+ years', required: false })
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: {
      monday: { start: '09:00', end: '17:00', isWorking: true },
      tuesday: { start: '09:00', end: '17:00', isWorking: true },
      wednesday: { start: '09:00', end: '17:00', isWorking: true },
      thursday: { start: '09:00', end: '17:00', isWorking: true },
      friday: { start: '09:00', end: '17:00', isWorking: true },
      saturday: { start: '09:00', end: '13:00', isWorking: true },
      sunday: { start: '00:00', end: '00:00', isWorking: false }
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  workingHours?: {
    [key: string]: { start: string; end: string; isWorking: boolean };
  };

  @ApiProperty({ example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  consultationFee?: number;
}
