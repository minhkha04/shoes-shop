import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBrandDto extends CreateBrandDto {
    
    @ApiProperty()
    @IsBoolean({ message: 'isActive must be a boolean value' })
    isActive: boolean;
}
