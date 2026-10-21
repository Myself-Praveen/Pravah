import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { clockService } from './clock.js';
import { registerRoutes } from './routes.js';
import { sweeper } from './sweeper.js';

dotenv.config();

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  },
});

async function bootstrap() {
  await clockService.init();

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'pravah-sih-2026-jwt-super-secret-key-32chars',
  });

  await registerRoutes(app);

  // Background sweeper interval (every 60s)
  setInterval(async () => {
    try {
      await sweeper.runSweep();
    } catch (e) {
      console.error('Periodic sweeper tick error:', e);
    }
  }, 60000);

  const port = parseInt(process.env.PORT || '4000', 10);
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
    console.log(`\n=================================================`);
    console.log(`🚀 PRAVAH-AICTE API Server running on http://localhost:${port}`);
    console.log(`📡 Endpoints: /api/v1/applications, /api/v1/analytics/command-center`);
    console.log(`⏱️ Clock Service Initialized (Virtual Simulated Time Active)`);
    console.log(`🛡️ Tamper-Evident SHA-256 Audit Trail Active`);
    console.log(`=================================================\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
