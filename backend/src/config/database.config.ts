import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { QueueItem } from '../queue/entities/queue-item.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    // For production, connect to AWS RDS MySQL
    if (isProduction) {
      return {
        type: 'mysql',
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('DB_PORT', 3306),
        username: this.configService.get('DB_USERNAME'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_DATABASE'),
        entities: [User, Doctor, Appointment, QueueItem],
        synchronize: false, // Never sync in production
        logging: false,
        ssl: {
          rejectUnauthorized: false, // Required for AWS RDS
        },
        timezone: '+00:00',
        charset: 'utf8mb4',
      };
    }

    // Development configuration
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 3306),
      username: this.configService.get('DB_USERNAME', 'root'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: this.configService.get('DB_DATABASE', 'meddesk_db'),
      entities: [User, Doctor, Appointment, QueueItem],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
      timezone: '+00:00',
      charset: 'utf8mb4',
    };
  }
}

// DataSource for TypeORM CLI
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'meddesk_db',
  entities: [User, Doctor, Appointment, QueueItem],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
