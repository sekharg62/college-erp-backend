import {
  JWT_DEFAULT_SECRET,
  JWT_EXPIRES_IN,
} from '../common/constants/auth.constants';

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET ?? JWT_DEFAULT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? JWT_EXPIRES_IN,
  },
});
