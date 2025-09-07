import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class CreateBrandDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @ApiProperty({ required: false })
    image?: string;
}
