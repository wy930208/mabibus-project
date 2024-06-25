import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CustomerComments } from '@/models/customer_comments.model';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [SequelizeModule.forFeature([CustomerComments])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CustomerCommentModule {}
