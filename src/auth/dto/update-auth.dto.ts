import { PartialType } from '@nestjs/mapped-types';
import { registerAuthDto } from './register-auth.dto';

export class UpdateAuthDto extends PartialType(registerAuthDto) {}
