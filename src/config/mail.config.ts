import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    username: process.env.MAIL_USERNAME ?? '',
    password: process.env.MAIL_PASSWORD ?? '',
  },
  ignoreTLS: process.env.MAIL_IGNORE_TLS
    ? process.env.MAIL_IGNORE_TLS === 'true'
    : true,
  secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === 'true' : false,
  from: {
    name: process.env.MAIL_FROM_NAME,
    address: process.env.MAIL_FROM_ADDRESS,
  },
  preview: process.env.MAIL_PREVIEW
    ? process.env.MAIL_PREVIEW === 'true'
    : true,
}));
