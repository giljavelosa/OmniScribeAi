import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../src/lib/db';
import { createTestPatient, cleanupTestData } from '../helpers/db';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';
import { canEditVisit, canViewVisit, SHARE_AUDIT_ACTIONS } from '../../src/lib/visit-access';
import { auditLog } from '../../src/lib/audit';

describe('Visit sharing policy integration', () => {
  const emails = [
    'owner-sharing@omniscribe.test',
    'org-peer@omniscribe.test',
    'outside-org@omniscribe.test',
  ];

  let ownerId = '';
  let orgPeerId = '';
  let outsideUserId = '';
  let orgId = '';
  let patientId = '';
  let visitId = '';

  beforeEach(async () => {
    const org = await prisma.organization.create({
      data: { name: 'Test Org Sharing' },
    });
    orgId = org.id;

    const owner = await createTestUser({
      email: emails[0],
      password: 'TestPassword123!',
      organizationId: orgId,
      name: 'Owner Clinician',
    });
    ownerId = owner.user.id;

    const peer = await createTestUser({
      email: emails[1],
      password: 'TestPassword123!',
      organizationId: orgId,
      name: 'Peer Clinician',
    });
    orgPeerId = peer.user.id;

    const outsideOrg = await prisma.organization.create({ data: { name: 'Other Org' } });
    const outside = await createTestUser({
      email: emails[2],
      password: 'TestPassword123!',
      organizationId: outsideOrg.id,
      name: 'Outside Clinician',
    });
    outsideUserId = outside.user.id;

    const patient = await createTestPatient('TEST-SHARE-PT-001');
    patientId = patient.id;

    const visit = await prisma.visit.create({
      data: {
        patientId,
        userId: ownerId,
        organizationId: orgId,
        visibility: 'private',
        frameworkId: 'soap-md-general',
        domain: 'medical',
        transcript: 'redacted for policy test',
      },
    });
    visitId = visit.id;
  });

  afterEach(async () => {
    await cleanupTestData();
    await cleanupTestUsers(emails);
  });

  it('allows same-organization users to view when visibility is organization', async () => {
    await prisma.visit.update({
      where: { id: visitId },
      data: { visibility: 'organization' },
    });

    const visit = await prisma.visit.findUniqueOrThrow({
      where: { id: visitId },
      select: { userId: true, organizationId: true, visibility: true, shareGrants: true },
    });

    const peerView = canViewVisit(
      visit,
      { id: orgPeerId, role: 'CLINICIAN', organizationId: orgId },
      visit.shareGrants,
    );
    expect(peerView.allowed).toBe(true);
    expect(peerView.reason).toBe('organization_visibility');

    const outsideView = canViewVisit(
      visit,
      { id: outsideUserId, role: 'CLINICIAN', organizationId: 'outside-org-id' },
      visit.shareGrants,
    );
    expect(outsideView.allowed).toBe(false);
  });

  it('allows restricted access only with active grant', async () => {
    await prisma.visit.update({
      where: { id: visitId },
      data: { visibility: 'restricted' },
    });

    await prisma.visitShareGrant.create({
      data: {
        visitId,
        granteeUserId: orgPeerId,
        grantedByUserId: ownerId,
        permission: 'view',
      },
    });

    const visit = await prisma.visit.findUniqueOrThrow({
      where: { id: visitId },
      select: {
        userId: true,
        organizationId: true,
        visibility: true,
        shareGrants: { select: { granteeUserId: true, revokedAt: true, permission: true } },
      },
    });

    const allowed = canViewVisit(
      visit,
      { id: orgPeerId, role: 'CLINICIAN', organizationId: orgId },
      visit.shareGrants,
    );
    expect(allowed.allowed).toBe(true);
    expect(allowed.reason).toBe('active_grant');

    await prisma.visitShareGrant.updateMany({
      where: { visitId, granteeUserId: orgPeerId },
      data: { revokedAt: new Date() },
    });

    const afterRevoke = await prisma.visit.findUniqueOrThrow({
      where: { id: visitId },
      select: {
        userId: true,
        organizationId: true,
        visibility: true,
        shareGrants: { select: { granteeUserId: true, revokedAt: true, permission: true } },
      },
    });

    const denied = canViewVisit(
      afterRevoke,
      { id: orgPeerId, role: 'CLINICIAN', organizationId: orgId },
      afterRevoke.shareGrants,
    );
    expect(denied.allowed).toBe(false);
  });

  it('does not escalate edit rights via sharing', async () => {
    await prisma.visit.update({
      where: { id: visitId },
      data: { visibility: 'organization' },
    });

    const visit = await prisma.visit.findUniqueOrThrow({
      where: { id: visitId },
      select: { userId: true, organizationId: true, visibility: true },
    });

    const peerEdit = canEditVisit(
      visit,
      { id: orgPeerId, role: 'CLINICIAN', organizationId: orgId },
    );
    expect(peerEdit.allowed).toBe(false);

    const ownerEdit = canEditVisit(
      visit,
      { id: ownerId, role: 'CLINICIAN', organizationId: orgId },
    );
    expect(ownerEdit.allowed).toBe(true);
  });

  it('records share audit events with metadata-only details', async () => {
    await auditLog({
      userId: ownerId,
      action: SHARE_AUDIT_ACTIONS.setVisibility,
      resource: `visit:${visitId}`,
      details: { visibility: 'organization', activeGrantCount: 0 },
    });

    await auditLog({
      userId: ownerId,
      action: SHARE_AUDIT_ACTIONS.denyShared,
      resource: `visit:${visitId}`,
      details: { reason: 'no_matching_policy', operation: 'update_share_config' },
    });

    const entries = await prisma.auditLog.findMany({
      where: { resource: `visit:${visitId}` },
      orderBy: { createdAt: 'asc' },
    });

    expect(entries.length).toBeGreaterThanOrEqual(2);
    expect(entries.some((e) => e.action === SHARE_AUDIT_ACTIONS.setVisibility)).toBe(true);
    expect(entries.some((e) => e.action === SHARE_AUDIT_ACTIONS.denyShared)).toBe(true);
  });
});

