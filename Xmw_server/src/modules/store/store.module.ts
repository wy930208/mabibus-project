import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Store } from '@/models/store.model';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  // 将实体 导入到这个module中，以便你这个module中的其它provider使用
  imports: [SequelizeModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
