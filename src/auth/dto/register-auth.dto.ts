import { IsEmail, IsNotEmpty, IsNumber, IsStrongPassword } from "class-validator";


export class registerAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsNumber()
    @IsNotEmpty()
    phone!: number

    @IsStrongPassword()
    @IsNotEmpty()
    password!: string
}
