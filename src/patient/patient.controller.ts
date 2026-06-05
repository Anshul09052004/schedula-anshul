import { Controller, Get, Headers, ForbiddenException } from '@nestjs/common';

@Controller('patient')
export class PatientController {
  @Get('profile')
  getPatientProfile(@Headers('role') role: string) {
    if (role !== 'PATIENT') {
      throw new ForbiddenException('Only Patient can access');
    }

    return {
      message: 'Patient Profile Accessed',
    };
  }
}