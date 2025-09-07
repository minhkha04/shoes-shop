import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CtreateProductVariantsDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Product colors is request' })
    product_colors_id: string;

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