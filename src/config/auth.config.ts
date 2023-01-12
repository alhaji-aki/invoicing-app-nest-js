import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.APP_KEY,
  expiresIn: process.env.AUTH_EXPIRES_IN,
  throttle: 60,
  expires: 60,
}));
