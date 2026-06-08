import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post('profile')
  createProfile(@Body() body: any) {
    return this.doctorService.create(body);
  }

  @Get('profile')
  getProfile() {
    return this.doctorService.getProfile();
  }

  @Patch('profile')
  updateProfile(@Body() body: any) {
    return this.doctorService.update(1, body);
  }
}