import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';

const app = express();

// compress api response
app.use(compression());

// security config, for protection against some CSRF, XSS, and clickjacking
app.use(helmet());

// cors enabled
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// parse cookie
app.use(cookieParser());
// no need to use body-parser library anymore, express already include body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all the api routers
app.use('/api', router);

export default app;
