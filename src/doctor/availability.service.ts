import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecurringAvailability } from '../entities/recurring-availability.entity';
import { CustomAvailability } from '../entities/custom-availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(RecurringAvailability)
    private recurringRepo: Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private customRepo: Repository<CustomAvailability>,
  ) { }

  async createRecurring(data: Partial<RecurringAvailability>) {
    if (data.startTime! >= data.endTime!) {
      return { message: 'Invalid time range' };
    }

    const existing = await this.recurringRepo.findOne({
      where: {
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    if (existing) {
      return { message: 'Duplicate availability' };
    }

    const slots = await this.recurringRepo.find({
      where: {
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
      },
    });

    const overlap = slots.find(
      (slot) =>
        data.startTime! < slot.endTime &&
        data.endTime! > slot.startTime,
    );

    if (overlap) {
      return {
        message: 'Overlapping time slot',
      };
    }

    const slot = this.recurringRepo.create(data);
    return await this.recurringRepo.save(slot);
  }

  async getRecurring() {
    return await this.recurringRepo.find();
  }

  async updateRecurring(
    id: number,
    data: Partial<RecurringAvailability>,
  ) {
    await this.recurringRepo.update(id, data);

    return await this.recurringRepo.findOne({
      where: { id },
    });
  }

  async deleteRecurring(id: number) {
    await this.recurringRepo.delete(id);

    return {
      message: 'Availability deleted successfully',
    };
  }

  async createOverride(data: Partial<CustomAvailability>) {
    if (data.startTime! >= data.endTime!) {
      return { message: 'Invalid time range' };
    }

    const slot = this.customRepo.create(data);
    return await this.customRepo.save(slot);
  }

  async getByDate(date: string) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return {
        message: 'Invalid date',
      };
    }

    const customAvailability = await this.customRepo.find({
      where: { date },
    });

    if (customAvailability.length > 0) {
      return customAvailability;
    }

    // Get weekday name
    const dayName = parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });


    const recurringAvailability = await this.recurringRepo.find({
      where: {
        dayOfWeek: dayName,
      },
    });

    if (recurringAvailability.length > 0) {
      return recurringAvailability;
    }

    return {
      message: 'No availability found',
    };
  }
}