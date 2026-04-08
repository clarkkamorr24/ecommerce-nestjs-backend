import { ApiProperty } from '@nestjs/swagger';
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headset',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headset',
  })
  description: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'Stock keep unit (SKU)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sku: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  category: string | null;

  @ApiProperty({
    description: 'Indicates if the product is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The date and time when the product was created',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the product was last updated',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
