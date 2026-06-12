import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Doctor } from './src/entities/doctor.entity';
import { Patient } from './src/entities/patient.entity';
import { RecurringAvailability } from './src/entities/recurring-availability.entity';
import { CustomAvailability } from './src/entities/custom-availability.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Doctor, Patient, RecurringAvailability, CustomAvailability],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});