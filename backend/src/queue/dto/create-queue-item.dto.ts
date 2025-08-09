import { IsNotEmpty, IsEnum, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '../entities/queue-item.entity';

export class CreateQueueItemDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({ enum: Priority, example: Priority.NORMAL })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ example: 15, description: 'Estimated wait time in minutes', required: false })
  @IsOptional()
  @IsNumber()
  estimatedWaitTime?: number;

  @ApiProperty({ example: 'appointment-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiProperty({ example: 'doctor-uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: 'Patient arrived early for appointment', required: false })
  @IsOptional()
  notes?: string;
}
