import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientService {
  private patientProfile: any = null;

  create(profile: any) {
    if (this.patientProfile) {
      return { message: 'Patient profile already exists' };
    }

    this.patientProfile = profile;

    return {
      message: 'Patient profile created',
      data: profile,
    };
  }

  getProfile() {
    return this.patientProfile || {
      message: 'Patient profile not found',
    };
  }

  update(profile: any) {
    if (!this.patientProfile) {
      return { message: 'Patient profile not found' };
    }

    this.patientProfile = {
      ...this.patientProfile,
      ...profile,
    };

    return {
      message: 'Patient profile updated',
      data: this.patientProfile,
    };
  }
}