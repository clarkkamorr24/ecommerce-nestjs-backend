import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
}
