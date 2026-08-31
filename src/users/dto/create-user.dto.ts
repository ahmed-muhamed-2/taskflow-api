import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';



export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsString()
    @IsNotEmpty()
    role!: string;
}