import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Store } from '@/models/store.model';
import { responseMessage } from '@/utils'; // 全局工具函数

// import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store)
    private readonly storeModel: typeof Store,
  ) {}

  async create(createStoreDto: any) {
    const result = await this.storeModel.create(createStoreDto);
    return responseMessage(result);
  }

  async findAll() {
    const storeList = await this.storeModel.findAll();
    return responseMessage(storeList);
  }

  // findOne(id: number) {
  //   const result = this.storeModel.destroy({
  //     where: { id },
  //   });
  //   return responseMessage(result);
  // }

  async update(id: string, updateStoreDto: any) {
    const result = await this.storeModel.update(updateStoreDto, {
      where: { id },
    });
    return responseMessage(result);
  }

  async remove(id: string) {
    const result = await this.storeModel.destroy({
      where: { id },
    });
    return responseMessage(result);
  }
}
