import { Body, Controller, Get, Post, Query, Session } from '@nestjs/common';

import type { SessionTypes } from '@/utils/types';

import { AppointmentService } from './appointment.service';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAppointmentList(
    @Query() query: { date: string },
    @Session() session: SessionTypes,
  ) {
    return this.appointmentService.findAll(query, session);
  }

  @Post()
  create(@Body() dto) {
    return this.appointmentService.create(dto);
  }
}
