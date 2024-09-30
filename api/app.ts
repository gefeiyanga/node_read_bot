import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello from Vercel Serverless Function!');
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'This is a test endpoint' });
});

export default app;