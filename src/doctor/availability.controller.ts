import { Controller, Post, Get, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('doctor/availability')
export class AvailabilityController {
    constructor(
        private readonly availabilityService: AvailabilityService,
    ) { }

    @Post()
    createRecurring(@Body() body: any) {
        return this.availabilityService.createRecurring(body);
    }

    @Get()
    getRecurring() {
        return this.availabilityService.getRecurring();
    }

    @Post('override')
    createOverride(@Body() body: any) {
        return this.availabilityService.createOverride(body);
    }

    @Get('date')
    getByDate(@Query('date') date: string) {
        return this.availabilityService.getByDate(date);
    }
    @Patch(':id')
    updateRecurring(
        @Param('id') id: string,
        @Body() body: any,
    ) {
        return this.availabilityService.updateRecurring(
            Number(id),
            body,
        );
    }

    @Delete(':id')
    deleteRecurring(@Param('id') id: string) {
        return this.availabilityService.deleteRecurring(
            Number(id),
        );
    }
}