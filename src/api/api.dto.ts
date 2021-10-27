import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { Empty } from '../empty.customValidation';

export class apiDto {
  @IsNotEmpty()
  @Validate(Empty, { message: 'Name is required' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Validate(Empty, { message: 'Amount is required' })
  amount: number;
}
