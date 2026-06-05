import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import { DoctorController } from './doctor/doctor.controller';
import { PatientController } from './patient/patient.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'schedula-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    DoctorController,
    PatientController,
  ],
  providers: [AppService, AuthService],
})
export class AppModule {}