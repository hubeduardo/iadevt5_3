import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRouter from './weather/weather.routes';

dotenv.config();

export function createApp(): Express {
  const app: Express = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req: Request, res: Response) => {
    void req;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/weather', weatherRouter);

  app.use((err: Error, req: Request, res: Response, next: unknown) => {
    void req;
    void next;
    console.error(err.stack);
    res.status(500).json({
      error: 'Something went wrong!',
      message: err.message
    });
  });

  return app;
}

export const app = createApp();

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}
