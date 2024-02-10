import { RegisterUserBody } from '../src/controllers/user.controller';

export const invalidRegistrationData: Partial<RegisterUserBody>[] = [
  {},
  { email: '', imageDataUri: '', name: '', password: '' },
  { email: 'bibekjodd@gmail.com', imageDataUri: '', name: '', password: '' },
  {
    email: 'bibekjodd@gmail.com',
    imageDataUri: '',
    name: 'abc',
    password: ''
  },
  {
    email: 'bibekjodd@gmail.com',
    imageDataUri: '',
    name: 'abcd',
    password: 'abcde'
  }
];
