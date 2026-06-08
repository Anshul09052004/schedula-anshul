import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(profile: Partial<Doctor>) {
    const doctor = this.doctorRepository.create(profile);
    return await this.doctorRepository.save(doctor);
  }

  async getProfile() {
    return await this.doctorRepository.find();
  }

  async update(id: number, profile: Partial<Doctor>) {
    await this.doctorRepository.update(id, profile);
    return await this.doctorRepository.findOneBy({ id });
  }
}