import fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';

config();

const app = fastify({ 
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  } 
});

await app.register(cors, {
  origin: true
});

app.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();