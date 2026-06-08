import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Post('profile')
  createProfile(@Body() body: any) {
    return this.patientService.create(body);
  }

  @Get('profile')
  getProfile() {
    return this.patientService.getProfile();
  }

  @Patch('profile')
  updateProfile(@Body() body: any) {
    return this.patientService.update(body);
  }
}