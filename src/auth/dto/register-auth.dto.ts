import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class registerAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsNotEmpty()
    phone!: string

    @IsStrongPassword()
    @IsNotEmpty()
    password!: string
}
