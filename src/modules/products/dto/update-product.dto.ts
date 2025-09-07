import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {

    @IsNotEmpty({ message: 'Name is required' })
    @ApiProperty()
    @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
    name: string;

    @IsNotEmpty({ message: 'Description is required' })
    @ApiProperty()
    description: string;

    @IsNotEmpty({ message: 'Price is required' })
    @ApiProperty()
    @IsNumber({}, { message: 'Price must be a number' })
    @Type(() => Number)
    price: number;

    @IsNotEmpty({ message: 'Brand is required' })
    @ApiProperty()
    @Length(1, 36, { message: 'Brand must be between 1 and 36 characters' })
    brand_id: string;

    @IsNotEmpty({ message: 'Category is required' })
    @ApiProperty()
    @Length(1, 36, { message: 'Category must be between 1 and 36 characters' })
    category_id: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive: boolean;
}
