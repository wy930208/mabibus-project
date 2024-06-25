import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: '妈咪巴士-泉州店', description: '店铺名称' })
  store_name: string;

  @ApiProperty({ example: '', description: '店铺类型' })
  shop: string;

  @ApiProperty({
    example: '福建省泉州市人民路建设路88号',
    description: '店铺地址',
  })
  address: string;

  @ApiProperty({ example: '16620096151', description: '联系电话' })
  phone: string;

  @ApiProperty({ example: 'WY', description: '店铺经理' })
  store_manager: string;
}
