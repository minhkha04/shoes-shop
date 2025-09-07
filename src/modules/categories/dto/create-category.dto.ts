import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty()
    @IsNotEmpty({message: 'Name is required'})
    @Length(2, 100, {message: 'Name must be between 2 and 100 characters'})
    name: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Description is required'})
    description: string;
}
