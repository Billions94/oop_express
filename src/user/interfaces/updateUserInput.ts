import { RegisterUserInput } from './registerUserInput';

export interface UpdateUserInput
  extends Omit<RegisterUserInput, 'confirmPassword'> {
  bio: string;
}
