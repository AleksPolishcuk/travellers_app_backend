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
      origin: function (origin, callback) {
        
        const allowedOrigins = [
          'http://localhost:3000',
          'https://travellers-app-frontend-qx5p.onrender.com' 
        ];
        
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.log('CORS blocked for origin:', origin);
          return callback(new Error('Not allowed by CORS'), false);
        }
      },
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
