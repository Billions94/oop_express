import { RegisterUserInput } from './registerUserInput';

export type LoginUserInput = Pick<RegisterUserInput, 'email' | 'password'>;
