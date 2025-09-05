import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty } from "class-validator";

export class UserUpdateDto {

    @IsNotEmpty({ message: 'Full name is required' })
    @ApiProperty()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Phone number is required' })
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Date of birth is required' })
    @IsDate({ message: 'Date of birth must be a valid date' })
    dateOfBirth: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'Sex is required' })
    sex: string;
}