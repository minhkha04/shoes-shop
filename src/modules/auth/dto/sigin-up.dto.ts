import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class SignUpDto {

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty()
    password: string;

    @IsNotEmpty({ message: 'Full name is required' })
    @ApiProperty()
    fullName: string;

    @IsNumber({}, { message: 'Code must be a number' })
    @IsNotEmpty({ message: 'Code is required' })
    @ApiProperty()
    code: number;
}
