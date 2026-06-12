import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecurringAvailability } from '../entities/recurring-availability.entity';
import { CustomAvailability } from '../entities/custom-availability.entity';
import { Doctor } from '../entities/doctor.entity';
import { BookedSlot } from '../entities/booked-slot.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(BookedSlot)
    private bookedSlotRepo: Repository<BookedSlot>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

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
      return { message: 'Overlapping time slot' };
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

  async getDoctorSlots(
    doctorId: number,
    date: string,
    duration: number,
  ) {
    const doctor = await this.doctorRepo.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      return { message: 'Doctor not found' };
    }

    if (![10, 15, 30].includes(duration)) {
      return { message: 'Invalid duration' };
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return { message: 'Invalid date' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { message: 'Past date not allowed' };
    }

    let availability: any[] = [];

    const customAvailability = await this.customRepo.find({
      where: {
        doctorId,
        date,
      },
    });

    if (customAvailability.length > 0) {
      availability = customAvailability;
    } else {
      const dayName = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });


      availability = await this.recurringRepo.find({
        where: {
          doctorId,
          dayOfWeek: dayName,
        },
      });


    }

    if (availability.length === 0) {
      return { message: 'No availability found' };
    }

    const bookedSlots = await this.bookedSlotRepo.find({
      where: {
        doctorId,
        date,
      },
    });

    const slots: string[] = [];

    for (const item of availability) {
      let current = this.timeToMinutes(item.startTime);
      const end = this.timeToMinutes(item.endTime);


      while (current + duration <= end) {
        const slotStart = this.minutesToTime(current);
        const slotEnd = this.minutesToTime(current + duration);

        const booked = bookedSlots.find(
          (slot) =>
            slot.startTime === slotStart &&
            slot.endTime === slotEnd,
        );

        if (!booked) {
          slots.push(`${slotStart}-${slotEnd}`);
        }

        current += duration;
      }


    }

    if (slots.length === 0) {
      return { message: 'No slots available' };
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }


}