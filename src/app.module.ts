import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DoctorController } from './doctor/doctor.controller';
import { PatientController } from './patient/patient.controller';
import { DoctorService } from './doctor/doctor.service';
import { PatientService } from './patient/patient.service';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    JwtModule.register({
      secret: 'schedula-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
      TypeOrmModule.forFeature([Doctor, Patient]),
  ],

  controllers: [
    AppController,
    AuthController,
    DoctorController,
    PatientController,
  ],

  providers: [AppService, AuthService, DoctorService, PatientService],
})
export class AppModule {}