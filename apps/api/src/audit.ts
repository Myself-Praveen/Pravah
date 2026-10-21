import crypto from 'crypto';
import { prisma, Role, ActorType, SignatureMethod } from '@pravah/db';
import { clockService } from './clock.js';
import { AuditVerificationResult } from '@pravah/shared';

export function canonicalJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJson).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalJson(obj[k])).join(',') + '}';
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export class AuditService {
  getGenesisHash(streamKey: string): string {
    return sha256(`PRAVAH-GENESIS|${streamKey}`);
  }

  async recordEvent(params: {
    streamKey: string;
    applicationId?: string | null;
    actorType: ActorType;
    actorId?: string | null;
    actorRole?: Role | null;
    actionType: string;
    entityType: string;
    entityId: string;
    previousState?: string | null;
    newState?: string | null;
    remarks?: string | null;
    payload: any;
    signature?: {
      userId: string;
      method: SignatureMethod;
      challengeRef?: string;
    };
  }) {
    const { streamKey, applicationId, actorType, actorId, actorRole, actionType, entityType, entityId, previousState, newState, remarks, payload, signature } = params;

    // Find the latest entry in this stream to get seq and prevHash
    const lastEntry = await prisma.auditLog.findFirst({
      where: { streamKey },
      orderBy: { seq: 'desc' },
    });

    const nextSeq = lastEntry ? lastEntry.seq + 1 : 1;
    const prevHash = lastEntry ? lastEntry.hash : this.getGenesisHash(streamKey);

    const payloadCanonical = canonicalJson(payload);
    const payloadHash = sha256(payloadCanonical);

    const canonicalInput = canonicalJson({
      streamKey,
      seq: nextSeq,
      actorType,
      actorId: actorId || null,
      actionType,
      entityType,
      entityId,
      previousState: previousState || null,
      newState: newState || null,
      payloadHash,
      prevHash,
    });

    const hash = sha256(canonicalInput);
    const createdAt = clockService.now();

    const entry = await prisma.auditLog.create({
      data: {
        streamKey,
        seq: nextSeq,
        applicationId,
        actorType,
        actorId,
        actorRole,
        actionType,
        entityType,
        entityId,
        previousState,
        newState,
        remarks,
        payload,
        payloadHash,
        prevHash,
        hash,
        createdAt,
        signature: signature ? {
          create: {
            userId: signature.userId,
            method: signature.method,
            signedAt: createdAt,
            challengeRef: signature.challengeRef,
          },
        } : undefined,
      },
    });

    return entry;
  }

  async verifyStream(streamKey: string): Promise<AuditVerificationResult> {
    const entries = await prisma.auditLog.findMany({
      where: { streamKey },
      orderBy: { seq: 'asc' },
    });

    if (entries.length === 0) {
      return {
        streamKey,
        isValid: true,
        totalEntries: 0,
        verifiedAt: clockService.now().toISOString(),
      };
    }

    let expectedPrevHash = this.getGenesisHash(streamKey);

    for (const entry of entries) {
      // Check previous hash link
      if (entry.prevHash !== expectedPrevHash) {
        return {
          streamKey,
          isValid: false,
          totalEntries: entries.length,
          brokenSeq: entry.seq,
          expectedHash: expectedPrevHash,
          actualHash: entry.prevHash,
          verifiedAt: clockService.now().toISOString(),
        };
      }

      // Check payload integrity
      const payloadCanonical = canonicalJson(entry.payload);
      const computedPayloadHash = sha256(payloadCanonical);
      if (computedPayloadHash !== entry.payloadHash) {
        return {
          streamKey,
          isValid: false,
          totalEntries: entries.length,
          brokenSeq: entry.seq,
          expectedHash: computedPayloadHash,
          actualHash: entry.payloadHash,
          verifiedAt: clockService.now().toISOString(),
        };
      }

      // Check entry hash integrity
      const canonicalInput = canonicalJson({
        streamKey: entry.streamKey,
        seq: entry.seq,
        actorType: entry.actorType,
        actorId: entry.actorId || null,
        actionType: entry.actionType,
        entityType: entry.entityType,
        entityId: entry.entityId,
        previousState: entry.previousState || null,
        newState: entry.newState || null,
        payloadHash: entry.payloadHash,
        prevHash: entry.prevHash,
      });

      const computedHash = sha256(canonicalInput);
      if (computedHash !== entry.hash) {
        return {
          streamKey,
          isValid: false,
          totalEntries: entries.length,
          brokenSeq: entry.seq,
          expectedHash: computedHash,
          actualHash: entry.hash,
          verifiedAt: clockService.now().toISOString(),
        };
      }

      expectedPrevHash = entry.hash;
    }

    return {
      streamKey,
      isValid: true,
      totalEntries: entries.length,
      verifiedAt: clockService.now().toISOString(),
    };
  }

  async simulateTampering(streamKey: string): Promise<{ success: boolean; tamperedSeq: number }> {
    const entry = await prisma.auditLog.findFirst({
      where: { streamKey },
      orderBy: { seq: 'desc' },
    });

    if (!entry) {
      throw new Error(`No audit entries exist for stream ${streamKey}`);
    }

    // Tamper with payload remarks directly without recomputing hash to trigger verifiable chain rupture
    await prisma.auditLog.update({
      where: { id: entry.id },
      data: { remarks: (entry.remarks || '') + ' [TAMPERED_RECORD_DEMO_ALERT]' },
    });

    return {
      success: true,
      tamperedSeq: entry.seq,
    };
  }
}

export const auditService = new AuditService();
