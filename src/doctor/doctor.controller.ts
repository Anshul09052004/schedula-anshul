import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AvailabilityService } from './availability.service';


@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly availabilityService: AvailabilityService,
  ) { }

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

  // Day 4 APIs

  @Get()
  getDoctors(
    @Query('specialization') specialization?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.doctorService.findAll(
      specialization,
      search,
      Number(page),
      Number(limit),
    );
  }
  @Get(':doctorId/slots')
  getDoctorSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('duration') duration = '15',
  ) {
    return this.availabilityService.getDoctorSlots(
      Number(doctorId),
      date,
      Number(duration),
    );
  }

  // @Get(':id')
  // getDoctorById(@Param('id') id: string) {
  //   return this.doctorService.findOne(Number(id));
  // }
}