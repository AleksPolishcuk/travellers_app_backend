import { getEnvVar } from './utils/getEnvVar.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';

const PORT = Number(getEnvVar('PORT'));

export const startServer = () => {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:4000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  );

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(router);
  app.use('/', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
