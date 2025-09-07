import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

class CreateProductVariantDto {
    @ApiProperty({ example: '41' })
    @IsString()
    @MinLength(1, { message: 'Size must be at least 1 character' })
    size: string;

    @ApiProperty({ example: 10, minimum: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock: number;
}

class CreateProductColorDto {
    @ApiProperty({ example: 'Black' })
    @IsString()
    @IsNotEmpty({ message: 'Color is required' })
    @MaxLength(50)
    color: string;

    @ApiProperty({ example: '#000000', description: 'Mã màu hex, có thể có/không # ở đầu' })
    @IsString()
    @IsNotEmpty({ message: 'Color code is required' })
    @MaxLength(20)
    @Matches(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: 'code phải là mã màu hex 3 hoặc 6 ký tự',
    })
    code: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Images are required' })
    @IsArray()
    images: string[];

    @ApiPropertyOptional({
        type: [CreateProductVariantDto],
        example: [
            { size: '40', stock: 5 },
            { size: '41', stock: 3 },
        ],
    })

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    @IsNotEmpty({ message: 'Variants are required' })
    variants: CreateProductVariantDto[];
}

export class CreateProductDto {

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

    @ApiProperty({ required: false })
    image_main?: string;

    @ApiProperty({ required: false })
    image_hover?: string;

    @ApiPropertyOptional({ type: [CreateProductColorDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @IsNotEmpty({ message: 'Colors are required' })
    @Type(() => CreateProductColorDto)
    colors: CreateProductColorDto[];
}
