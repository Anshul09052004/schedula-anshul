import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Doctor } from './src/entities/doctor.entity';
import { Patient } from './src/entities/patient.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Doctor, Patient],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});