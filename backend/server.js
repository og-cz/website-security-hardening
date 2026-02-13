import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'; // Import helmet
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// 1. SECURITY HEADERS (The Quick Wins)
app.disable('x-powered-by'); // Tanggal ang X-Powered-By

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*.paypal.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.paypal.com"],
        connectSrc: ["'self'", "*.paypal.com"],
        frameSrc: ["'self'", "*.paypal.com"],
      },
    },
    // Fix para sa Server Version Leak
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Custom middleware para siguradong tanggal ang "Server" header
app.use((req, res, next) => {
  res.removeHeader("Server");
  next();
});

// 2. CORS CONFIGURATION
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('X-Server-Time', 'false');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. ROUTES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();

// 4. STATIC FOLDERS WITH CACHE CONTROL
app.use('/uploads', express.static(path.join(__dirname, '/uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('X-Content-Type-Options', 'nosniff'); // Extra protection
  }
}));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);