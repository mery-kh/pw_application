import { IsEmail, MinLength, Validate } from 'class-validator';
import validationMessage from '../validation.messages';
import { Empty } from '../empty.customValidation';

export class signInDto {
  @IsEmail({}, { message: validationMessage.email })
  email: string;

  @Validate(Empty, { message: 'Password field is required' })
  password: string;
}

export class signUpDto {
  @Validate(Empty, { message: 'Username field is required' })
  username: string;

  @IsEmail({}, { message: validationMessage.email })
  email: string;

  @MinLength(8, { message: validationMessage.min })
  @Validate(Empty, { message: 'Password field is required' })
  password: string;
}
