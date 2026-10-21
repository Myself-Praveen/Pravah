import { prisma, SlaState, ComplianceStatus, DocStatus, EvcStatus, NotificationChannel, Role } from '@pravah/db';
import { clockService } from './clock.js';
import { auditService } from './audit.js';
import { calculateWorkingDays, computeSlaPercentage, getSlaStateFromPercentage } from '@pravah/workflow';

export class DeterministicSweeper {
  private isSweeping: boolean = false;
  private lastRunAt: Date = new Date();
  private catchUpCount: number = 0;

  async runSweep(): Promise<{ sweptAt: string; actionsTaken: number; catchUpCount: number }> {
    if (this.isSweeping) return { sweptAt: this.lastRunAt.toISOString(), actionsTaken: 0, catchUpCount: this.catchUpCount };
    this.isSweeping = true;

    let actionsTaken = 0;
    const now = clockService.now();
    this.lastRunAt = now;

    try {
      // 1. Applications SLA Sweep
      const activeApps = await prisma.application.findMany({
        where: {
          status: 'IN_PROGRESS',
        },
        include: {
          institution: true,
          assignedOfficer: true,
        },
      });

      for (const app of activeApps) {
        if (!app.stageSlaDeadline) continue;

        // Compute working days elapsed
        const elapsedDays = calculateWorkingDays(app.stageEnteredAt, now);
        const totalDurationDays = 7; // standard placeholder stage duration
        const pausedDays = Math.floor(app.slaPausedTotalSec / 86400);
        const slaPct = computeSlaPercentage(app.stageEnteredAt, now, totalDurationDays, pausedDays);
        const newState = getSlaStateFromPercentage(slaPct, app.status === 'WITH_INSTITUTION');

        let escalationLevel = app.escalationLevel;

        // Tier 0: 75% AMBER warning
        if (slaPct >= 75 && slaPct < 100 && app.slaState !== SlaState.AMBER) {
          const dedupeKey = `APP:${app.id}:TIER_75`;
          const exists = await prisma.notification.findUnique({ where: { dedupeKey } });
          if (!exists) {
            await prisma.notification.create({
              data: {
                dedupeKey,
                recipientId: app.assignedOfficerId || 'usr-scrutiny-south1',
                channel: NotificationChannel.IN_APP,
                templateCode: 'SLA_WARN_75',
                payload: { applicationId: app.id, applicationNumber: app.applicationNumber, slaPct },
                relatedType: 'Application',
                relatedId: app.id,
                dueAt: now,
                dispatchedAt: now,
                isCatchUp: clockService.getOffsetSeconds() > 0,
              },
            });
            actionsTaken++;
          }
        }

        // Tier 1: 100% RED breach (escalate to RO)
        if (slaPct >= 100 && slaPct < 125 && app.escalationLevel < 1) {
          escalationLevel = 1;
          const dedupeKey = `APP:${app.id}:TIER_100`;
          const exists = await prisma.notification.findUnique({ where: { dedupeKey } });
          if (!exists) {
            await prisma.notification.create({
              data: {
                dedupeKey,
                recipientId: 'usr-ro-south',
                channel: NotificationChannel.IN_APP,
                templateCode: 'SLA_BREACH_100',
                payload: { applicationId: app.id, applicationNumber: app.applicationNumber, slaPct, stage: app.currentStage },
                relatedType: 'Application',
                relatedId: app.id,
                dueAt: now,
                dispatchedAt: now,
                isCatchUp: clockService.getOffsetSeconds() > 0,
              },
            });
            actionsTaken++;
          }
        }

        // Tier 2: 125% CRITICAL (escalate to Bureau Head)
        if (slaPct >= 125 && app.escalationLevel < 2) {
          escalationLevel = 2;
          const dedupeKey = `APP:${app.id}:TIER_125`;
          const exists = await prisma.notification.findUnique({ where: { dedupeKey } });
          if (!exists) {
            await prisma.notification.create({
              data: {
                dedupeKey,
                recipientId: 'usr-hq-head',
                channel: NotificationChannel.IN_APP,
                templateCode: 'SLA_CRITICAL_125',
                payload: { applicationId: app.id, applicationNumber: app.applicationNumber, slaPct, stage: app.currentStage },
                relatedType: 'Application',
                relatedId: app.id,
                dueAt: now,
                dispatchedAt: now,
                isCatchUp: clockService.getOffsetSeconds() > 0,
              },
            });
            actionsTaken++;
          }
        }

        if (newState !== app.slaState || escalationLevel !== app.escalationLevel) {
          await prisma.application.update({
            where: { id: app.id },
            data: {
              slaState: newState,
              escalationLevel,
            },
          });

          await auditService.recordEvent({
            streamKey: `APP:${app.id}`,
            applicationId: app.id,
            actorType: 'SYSTEM',
            actorId: 'system-sweeper',
            actionType: 'SLA_STATE_CHANGED',
            entityType: 'Application',
            entityId: app.id,
            previousState: app.slaState,
            newState,
            remarks: `SLA state recomputed by deterministic sweeper to ${newState} (${slaPct}% consumed).`,
            payload: { slaPct, escalationLevel },
          });
          actionsTaken++;
        }
      }

      // 2. Undertakings Sweep (Breach detection)
      const pendingUndertakings = await prisma.undertaking.findMany({
        where: {
          status: { in: [ComplianceStatus.PENDING_SUBMISSION, ComplianceStatus.SUBMITTED_UNDER_REVIEW] },
          dueDate: { lte: now },
        },
      });

      for (const u of pendingUndertakings) {
        await prisma.undertaking.update({
          where: { id: u.id },
          data: {
            status: ComplianceStatus.BREACHED_ESCALATED,
            escalationLevel: 2,
          },
        });

        const dedupeKey = `UNDERTAKING:${u.id}:BREACHED`;
        const exists = await prisma.notification.findUnique({ where: { dedupeKey } });
        if (!exists) {
          await prisma.notification.create({
            data: {
              dedupeKey,
              recipientId: 'usr-ro-south',
              channel: NotificationChannel.IN_APP,
              templateCode: 'UNDERTAKING_OVERDUE',
              payload: { undertakingId: u.id, conditionTitle: u.conditionTitle, dueDate: u.dueDate },
              relatedType: 'Undertaking',
              relatedId: u.id,
              dueAt: now,
              dispatchedAt: now,
              isCatchUp: clockService.getOffsetSeconds() > 0,
            },
          });
          if (clockService.getOffsetSeconds() > 0) this.catchUpCount++;
          actionsTaken++;
        }

        await auditService.recordEvent({
          streamKey: `APP:${u.applicationId}`,
          applicationId: u.applicationId,
          actorType: 'SYSTEM',
          actorId: 'system-sweeper',
          actionType: 'UNDERTAKING_BREACHED',
          entityType: 'Undertaking',
          entityId: u.id,
          previousState: u.status,
          newState: ComplianceStatus.BREACHED_ESCALATED,
          remarks: `Undertaking passed due date without verified completion. Enqueued in show-cause review queue.`,
          payload: { conditionCode: u.conditionCode, dueDate: u.dueDate },
        });
        actionsTaken++;
      }

      // 3. Tracked Documents Expiry Sweep
      const activeDocs = await prisma.trackedDocument.findMany({
        where: {
          status: { in: [DocStatus.VALID, DocStatus.EXPIRING] },
          expiryDate: { not: null },
        },
      });

      for (const doc of activeDocs) {
        if (!doc.expiryDate) continue;

        if (doc.expiryDate <= now && doc.status !== DocStatus.EXPIRED) {
          // Document Expired!
          await prisma.trackedDocument.update({
            where: { id: doc.id },
            data: { status: DocStatus.EXPIRED, escalationLevel: 2 },
          });

          // Flag institution as COMPLIANCE_DEFICIENT
          await prisma.institution.update({
            where: { id: doc.institutionId },
            data: { complianceHealth: 'COMPLIANCE_DEFICIENT' },
          });

          const dedupeKey = `DOC:${doc.id}:EXPIRED`;
          const exists = await prisma.notification.findUnique({ where: { dedupeKey } });
          if (!exists) {
            await prisma.notification.create({
              data: {
                dedupeKey,
                recipientId: 'usr-ro-south',
                channel: NotificationChannel.IN_APP,
                templateCode: 'DOC_EXPIRED_ALERT',
                payload: { docId: doc.id, docTypeCode: doc.docTypeCode, expiryDate: doc.expiryDate },
                relatedType: 'TrackedDocument',
                relatedId: doc.id,
                dueAt: now,
                dispatchedAt: now,
                isCatchUp: clockService.getOffsetSeconds() > 0,
              },
            });
            actionsTaken++;
          }
        }
      }
    } catch (e) {
      console.error('Error during sweeper execution:', e);
    } finally {
      this.isSweeping = false;
    }

    return {
      sweptAt: this.lastRunAt.toISOString(),
      actionsTaken,
      catchUpCount: this.catchUpCount,
    };
  }

  getLastRunAt(): Date {
    return this.lastRunAt;
  }

  getCatchUpCount(): number {
    return this.catchUpCount;
  }
}

export const sweeper = new DeterministicSweeper();
