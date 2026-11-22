import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BLUEPRINT_LIMITS,
  BOOTSTRAP_DIRECTOR_EMAIL,
  clampText,
  sanitizeFirestoreId,
} from './src/firebase';

const rootDir = process.cwd();
const rulesContent = fs.readFileSync(path.join(rootDir, 'firestore.rules'), 'utf8');
const blueprint = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'firebase-blueprint.json'), 'utf8'),
) as {
  entities: Record<string, unknown>;
  firestore: Record<string, unknown>;
};

describe('Firebase Security Rules & Blueprint Contract', () => {
  it('enforces default-deny fallback and email verification helpers', () => {
    expect(rulesContent).toContain("rules_version = '2';");
    expect(rulesContent).toContain('match /{document=**}');
    expect(rulesContent).toContain('allow read, write: if false;');
    expect(rulesContent).toContain('request.auth.token.email_verified == true');
    expect(rulesContent).toContain('request.time');
    expect(rulesContent).toContain(BOOTSTRAP_DIRECTOR_EMAIL);
    expect(BOOTSTRAP_DIRECTOR_EMAIL).toBe('Gelasemi@gmail.com');
  });

  it('prevents list query cost explosions and locks immutable audit collections', () => {
    const listLines = rulesContent
      .split('\n')
      .filter((line) => line.trim().startsWith('allow list:'));

    expect(listLines.length).toBeGreaterThanOrEqual(6);
    for (const line of listLines) {
      expect(line).not.toContain('exists(');
      expect(line).not.toContain('get(');
      expect(line).not.toContain('isAdmin()');
    }

    // chat_logs and sync_snapshots are strictly append-only (no client update)
    const chatSection = rulesContent.slice(rulesContent.indexOf('match /chat_logs/{logId}'));
    expect(chatSection).toContain('allow update: if false;');

    const syncSection = rulesContent.slice(rulesContent.indexOf('match /sync_snapshots/{snapshotId}'));
    expect(syncSection).toContain('allow update: if false;');
  });

  it('blocks self-privilege escalation and keeps all blueprint collections aligned', () => {
    expect(rulesContent).toContain("incoming().role in ['analyst', 'cooperative'] || isAdmin()");
    expect(rulesContent).toContain("existing().status in ['draft', 'submitted']");

    expect(blueprint.entities).toHaveProperty('GlobalSyncSnapshot');
    expect(blueprint.entities).toHaveProperty('UserProfile');
    expect(blueprint.entities).toHaveProperty('SavedAnalysis');
    expect(blueprint.entities).toHaveProperty('ChatLog');
    expect(blueprint.entities).toHaveProperty('CooperativeDossier');
    expect(blueprint.firestore).toHaveProperty('/sync_snapshots/{snapshotId}');
  });

  it('sanitizes Firestore document IDs and clamps text within BLUEPRINT_LIMITS', () => {
    const cleanId = sanitizeFirestoreId('  Androy / Ambovombe 2027!  ');
    expect(cleanId).toMatch(BLUEPRINT_LIMITS.idPattern);
    expect(cleanId.length).toBeLessThanOrEqual(BLUEPRINT_LIMITS.idMaxLength);

    expect(clampText('   ', 40, 'fallback')).toBe('fallback');
    expect(clampText('A'.repeat(200), 50).length).toBe(50);
  });
});
