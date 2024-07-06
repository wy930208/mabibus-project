import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Appointment } from '@/models/appointment_service.model';
import { Coupons } from '@/models/coupons.model';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [SequelizeModule.forFeature([Appointment, Coupons])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
