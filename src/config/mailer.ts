import { resolve } from 'path';
import { createTransport, TestAccount, createTestAccount } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as hbs from 'nodemailer-express-handlebars';

const env = process.env.NODE_ENV ?? '';
const testAccount = async (): Promise<TestAccount | null> => {
  const usuario = await createTestAccount();
  return env === 'test' ? usuario : null;
};

const config = {
  production: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    logger: true,
    transactionLog: true,
  },
  development: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  test: {
    host: 'smtp.ethereal.email',
    port: '587',
    auth: {
      user: testAccount().then((x) => x?.user),
      pass: testAccount().then((x) => x?.pass),
    },
  },
}[env];

export const useTransport = async () => {
  const configSMTP = config as SMTPTransport.Options;
  const transport = createTransport(configSMTP);

  transport.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.html',
        partialsDir: resolve('./src/resources/email/'),
        layoutsDir: resolve('./src/resources/email/'),
      },
      viewPath: resolve('./src/resources/email/'),
      extName: '.html',
    }),
  );

  return transport;
};
