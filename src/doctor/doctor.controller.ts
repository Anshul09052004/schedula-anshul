import { Controller, Get, Headers, ForbiddenException } from '@nestjs/common';

@Controller('doctor')
export class DoctorController {
  @Get('profile')
  getDoctorProfile(@Headers('role') role: string) {
    if (role !== 'DOCTOR') {
      throw new ForbiddenException('Only Doctor can access');
    }

    return {
      message: 'Doctor Profile Accessed',
    };
  }
}