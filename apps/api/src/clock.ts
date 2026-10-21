import { prisma } from '@pravah/db';

class ClockService {
  private offsetSeconds: number = 0;
  private isLoaded: boolean = false;

  async init() {
    try {
      const clock = await prisma.systemClock.findUnique({ where: { id: 1 } });
      if (clock) {
        this.offsetSeconds = clock.offsetSeconds;
      }
    } catch {
      this.offsetSeconds = 0;
    }
    this.isLoaded = true;
  }

  now(): Date {
    const realNow = new Date();
    return new Date(realNow.getTime() + this.offsetSeconds * 1000);
  }

  getOffsetSeconds(): number {
    return this.offsetSeconds;
  }

  async advanceTime(days: number): Promise<Date> {
    this.offsetSeconds += days * 86400;
    try {
      await prisma.systemClock.upsert({
        where: { id: 1 },
        update: { offsetSeconds: this.offsetSeconds },
        create: { id: 1, offsetSeconds: this.offsetSeconds, demoMode: true },
      });
    } catch (e) {
      console.error('Failed to persist clock offset:', e);
    }
    return this.now();
  }

  async reset(): Promise<Date> {
    this.offsetSeconds = 0;
    try {
      await prisma.systemClock.upsert({
        where: { id: 1 },
        update: { offsetSeconds: 0 },
        create: { id: 1, offsetSeconds: 0, demoMode: true },
      });
    } catch (e) {
      console.error('Failed to reset clock offset:', e);
    }
    return this.now();
  }
}

export const clockService = new ClockService();
