import { getEnvVar } from './utils/getEnvVar.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(getEnvVar('PORT'));

export const startServer = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(cookieParser());

  const allowedOrigins = [
    'http://localhost:3000',
    'https://travellers-app-frontend.vercel.app',
  ];

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true); // SSR/health-check
        if (allowedOrigins.includes(origin)) return callback(null, true);

        console.log('CORS blocked for origin:', origin);
        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204,
    }),
  );

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use('/api-docs', swaggerDocs());

  app.use(router);
  app.use('/', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
