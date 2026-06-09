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

  // Day 4 - Doctor Listing and Search APIs

  async findAll(
    specialization?: string,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    if (page < 1 || limit < 1) {
      return {
        message: 'Invalid pagination values',
      };
    }

    const query = this.doctorRepository.createQueryBuilder('doctor');

    if (specialization) {
      query.andWhere(
        'LOWER(doctor.specialization) = LOWER(:specialization)',
        { specialization },
      );
    }

    if (search) {
      query.andWhere(
        'LOWER(doctor.fullName) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    query.skip((page - 1) * limit);
    query.take(limit);

    const doctors = await query.getMany();

    if (!doctors.length) {
      return {
        message: 'No doctors found',
      };
    }

    return doctors;
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepository.findOneBy({ id });

    if (!doctor) {
      return {
        message: 'Doctor not found',
      };
    }

    return doctor;
  }
}