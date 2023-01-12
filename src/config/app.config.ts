import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  key: process.env.APP_KEY,
  environment: process.env.NODE_ENV || 'development',
  frontend_password_reset_url:
    process.env.APP_FRONTEND_PASSWORD_RESET_URL || 'http://localhost',
}));
