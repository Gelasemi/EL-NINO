import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Always bind firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const BOOTSTRAP_DIRECTOR_EMAIL = 'Gelasemi@gmail.com';

export const BLUEPRINT_LIMITS = {
  idPattern: /^[a-zA-Z0-9_-]+$/,
  idMaxLength: 128,
  displayNameMaxLength: 120,
  organizationMaxLength: 140,
  emailMaxLength: 180,
  scopeMaxLength: 60,
  regionNameMaxLength: 140,
  summaryMaxLength: 2500,
  promptMaxLength: 1500,
  replyMaxLength: 4000,
  cooperativeNameMaxLength: 140,
  districtMaxLength: 100,
  cropMaxLength: 80,
  reviewNoteMaxLength: 600,
  syncTriggeredByMaxLength: 40,
  maxRequestedMUsd: 500,
} as const;

export function sanitizeFirestoreId(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, BLUEPRINT_LIMITS.idMaxLength);
  return cleaned || `id-${Date.now()}`;
}

export function clampText(raw: string, maxLen: number, fallback = '-'): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();
