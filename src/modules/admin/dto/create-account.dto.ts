import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Role } from "src/enums/roles.enum";

export class CreateAccountDto {

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty()
    @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
    password: string;

    @IsNotEmpty({ message: 'Full name is required' })
    @ApiProperty()
    fullName: string;

    @IsNotEmpty({ message: 'Role is required' })
    @ApiProperty()
    role: Role;
}
