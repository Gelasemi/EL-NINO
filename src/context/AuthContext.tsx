import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  auth,
  BLUEPRINT_LIMITS,
  BOOTSTRAP_DIRECTOR_EMAIL,
  clampText,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  sanitizeFirestoreId,
} from '../firebase';
import type { WorldLanguageCode } from '../i18n/LanguageContext';

export type WorkspaceRole = 'director' | 'analyst' | 'cooperative';

export interface UserWorkspaceProfile {
  uid: string;
  displayName: string;
  role: WorkspaceRole;
  organization: string;
  language: WorldLanguageCode;
}

export interface PersistedAnalysis {
  id: string;
  ownerUid: string;
  roleTag: WorkspaceRole;
  scope: string;
  regionName: string;
  year: number;
  scenario: 's1' | 's2' | 's3' | 'baseline' | 'severe' | 'adaptation';
  summary: string;
  createdAt?: Timestamp | null;
}

export interface PersistedChatLog {
  id: string;
  ownerUid: string;
  roleId: 'agronome' | 'economiste' | 'humanitaire';
  zoneName: string;
  prompt: string;
  reply: string;
  createdAt?: Timestamp | null;
}

export interface CooperativeDossier {
  id: string;
  ownerUid: string;
  cooperativeName: string;
  district: string;
  crop: string;
  requestedMUsd: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  reviewNote: string;
  createdAt?: Timestamp | null;
}

export interface PersistedSyncSnapshot {
  id: string;
  ownerUid: string;
  triggeredBy: 'manual' | 'midnight-cron';
  midnightEnabled: boolean;
  oniIndex: number;
  countriesUpdated: number;
  scrapedSourcesCount: number;
  summary: string;
  createdAt?: Timestamp | null;
}

interface AuthContextValue {
  user: User | null;
  profile: UserWorkspaceProfile | null;
  isAdmin: boolean;
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  savedAnalyses: PersistedAnalysis[];
  chatLogs: PersistedChatLog[];
  dossiers: CooperativeDossier[];
  syncSnapshots: PersistedSyncSnapshot[];
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateWorkspaceProfile: (patch: {
    displayName?: string;
    organization?: string;
    language?: WorldLanguageCode;
  }) => Promise<void>;
  saveAnalysisSnapshot: (input: {
    scope: string;
    regionName: string;
    year: number;
    scenario: PersistedAnalysis['scenario'];
    summary: string;
  }) => Promise<boolean>;
  deleteSavedAnalysis: (id: string) => Promise<void>;
  saveChatInteraction: (input: {
    roleId: PersistedChatLog['roleId'];
    zoneName: string;
    prompt: string;
    reply: string;
  }) => Promise<void>;
  saveSyncSnapshot: (input: {
    triggeredBy: 'manual' | 'midnight-cron';
    midnightEnabled: boolean;
    oniIndex: number;
    countriesUpdated: number;
    scrapedSourcesCount: number;
    summary: string;
  }) => Promise<void>;
  createCooperativeDossier: (input: {
    cooperativeName: string;
    district: string;
    crop: string;
    requestedMUsd: number;
    submitImmediately?: boolean;
  }) => Promise<void>;
  submitCooperativeDossier: (id: string) => Promise<void>;
  reviewCooperativeDossier: (
    id: string,
    decision: 'approved' | 'rejected',
    reviewNote: string,
  ) => Promise<void>;
  deleteDraftDossier: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class FirebaseErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Workspace error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FirebaseErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-6 max-w-2xl rounded-md border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
          <p className="font-semibold">Observatory Persistence Notice</p>
          <p className="mt-1 font-mono break-all">{this.state.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="mt-3 rounded bg-rose-700 px-3 py-1.5 font-semibold text-white hover:bg-rose-800"
          >
            Reload Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserWorkspaceProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [savedAnalyses, setSavedAnalyses] = useState<PersistedAnalysis[]>([]);
  const [chatLogs, setChatLogs] = useState<PersistedChatLog[]>([]);
  const [dossiers, setDossiers] = useState<CooperativeDossier[]>([]);
  const [syncSnapshots, setSyncSnapshots] = useState<PersistedSyncSnapshot[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError(null);

      if (!nextUser) {
        setProfile(null);
        setIsAdmin(false);
        setSavedAnalyses([]);
        setChatLogs([]);
        setDossiers([]);
        setSyncSnapshots([]);
        setAuthReady(true);
        return;
      }

      try {
        const uid = sanitizeFirestoreId(nextUser.uid);
        const isBootstrap =
          Boolean(nextUser.emailVerified) &&
          nextUser.email?.toLowerCase() === BOOTSTRAP_DIRECTOR_EMAIL.toLowerCase();

        let adminDocExists = false;
        try {
          const adminSnap = await getDoc(doc(db, 'admins', uid));
          adminDocExists = adminSnap.exists();
        } catch {
          adminDocExists = false;
        }
        const computedAdmin = isBootstrap || adminDocExists;
        setIsAdmin(computedAdmin);

        const userDocRef = doc(db, 'users', uid);
        const existingSnap = await getDoc(userDocRef).catch((err) =>
          handleFirestoreError(err, OperationType.GET, `users/${uid}`),
        );

        if (!existingSnap.exists()) {
          const initialProfile: UserWorkspaceProfile = {
            uid,
            displayName: clampText(
              nextUser.displayName || nextUser.email?.split('@')[0] || 'Observatory Analyst',
              BLUEPRINT_LIMITS.displayNameMaxLength,
            ),
            role: computedAdmin ? 'director' : 'analyst',
            organization: computedAdmin ? 'M&G Consulting' : 'Coopérative / Observatoire Régional',
            language: 'fr',
          };
          await setDoc(userDocRef, {
            ...initialProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `users/${uid}`));
          setProfile(initialProfile);
        } else {
          const d = existingSnap.data();
          setProfile({
            uid: String(d.uid || uid),
            displayName: String(d.displayName || 'User'),
            role: (d.role as WorkspaceRole) || (computedAdmin ? 'director' : 'analyst'),
            organization: String(d.organization || 'M&G Consulting'),
            language: (d.language as WorldLanguageCode) || 'fr',
          });
        }

        // Write owner-isolated PII record cleanly
        if (nextUser.email) {
          const privPath = `users/${uid}/private/info`;
          await setDoc(
            doc(db, 'users', uid, 'private', 'info'),
            {
              uid,
              email: clampText(nextUser.email, BLUEPRINT_LIMITS.emailMaxLength),
              lastLoginAt: serverTimestamp(),
            },
            { merge: false },
          ).catch((err) => handleFirestoreError(err, OperationType.WRITE, privPath));
        }
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'Firebase session error');
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  // Attach real-time Firestore listeners only once auth is ready & user authenticated
  useEffect(() => {
    if (!authReady || !user) return;
    const uid = sanitizeFirestoreId(user.uid);

    const analysesQuery = isAdmin
      ? collection(db, 'analyses')
      : query(collection(db, 'analyses'), where('ownerUid', '==', uid));

    const unsubAnalyses = onSnapshot(
      analysesQuery,
      (snap) => {
        const items: PersistedAnalysis[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            ownerUid: String(v.ownerUid),
            roleTag: (v.roleTag as WorkspaceRole) || 'analyst',
            scope: String(v.scope || ''),
            regionName: String(v.regionName || ''),
            year: Number(v.year || 2027),
            scenario: (v.scenario as PersistedAnalysis['scenario']) || 's2',
            summary: String(v.summary || ''),
            createdAt: (v.createdAt as Timestamp | null) ?? null,
          };
        });
        items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setSavedAnalyses(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'analyses'),
    );

    const logsQuery = isAdmin
      ? collection(db, 'chat_logs')
      : query(collection(db, 'chat_logs'), where('ownerUid', '==', uid));

    const unsubLogs = onSnapshot(
      logsQuery,
      (snap) => {
        const items: PersistedChatLog[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            ownerUid: String(v.ownerUid),
            roleId: (v.roleId as PersistedChatLog['roleId']) || 'agronome',
            zoneName: String(v.zoneName || 'Madagascar'),
            prompt: String(v.prompt || ''),
            reply: String(v.reply || ''),
            createdAt: (v.createdAt as Timestamp | null) ?? null,
          };
        });
        items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setChatLogs(items.slice(0, 30));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'chat_logs'),
    );

    const dossiersQuery = isAdmin
      ? collection(db, 'cooperative_dossiers')
      : query(collection(db, 'cooperative_dossiers'), where('ownerUid', '==', uid));

    const unsubDossiers = onSnapshot(
      dossiersQuery,
      (snap) => {
        const items: CooperativeDossier[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            ownerUid: String(v.ownerUid),
            cooperativeName: String(v.cooperativeName || ''),
            district: String(v.district || ''),
            crop: String(v.crop || ''),
            requestedMUsd: Number(v.requestedMUsd || 0),
            status: (v.status as CooperativeDossier['status']) || 'draft',
            reviewNote: String(v.reviewNote || ''),
            createdAt: (v.createdAt as Timestamp | null) ?? null,
          };
        });
        items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setDossiers(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'cooperative_dossiers'),
    );

    const syncQuery = isAdmin
      ? collection(db, 'sync_snapshots')
      : query(collection(db, 'sync_snapshots'), where('ownerUid', '==', uid));

    const unsubSync = onSnapshot(
      syncQuery,
      (snap) => {
        const items: PersistedSyncSnapshot[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            ownerUid: String(v.ownerUid),
            triggeredBy: v.triggeredBy === 'midnight-cron' ? 'midnight-cron' : 'manual',
            midnightEnabled: Boolean(v.midnightEnabled),
            oniIndex: Number(v.oniIndex ?? 3.5),
            countriesUpdated: Number(v.countriesUpdated ?? 195),
            scrapedSourcesCount: Number(v.scrapedSourcesCount ?? 0),
            summary: String(v.summary || ''),
            createdAt: (v.createdAt as Timestamp | null) ?? null,
          };
        });
        items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setSyncSnapshots(items.slice(0, 20));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'sync_snapshots'),
    );

    return () => {
      unsubAnalyses();
      unsubLogs();
      unsubDossiers();
      unsubSync();
    };
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Google Sign-In cancelled or failed.');
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const updateWorkspaceProfile = useCallback(
    async (patch: {
      displayName?: string;
      organization?: string;
      language?: WorldLanguageCode;
    }) => {
      if (!user || !profile) return;
      const uid = sanitizeFirestoreId(user.uid);
      const nextDisplay = patch.displayName
        ? clampText(patch.displayName, BLUEPRINT_LIMITS.displayNameMaxLength)
        : profile.displayName;
      const nextOrg = patch.organization
        ? clampText(patch.organization, BLUEPRINT_LIMITS.organizationMaxLength)
        : profile.organization;
      const nextLang = patch.language ?? profile.language;

      try {
        await updateDoc(doc(db, 'users', uid), {
          displayName: nextDisplay,
          organization: nextOrg,
          language: nextLang,
          updatedAt: serverTimestamp(),
        });
        setProfile((prev) =>
          prev
            ? { ...prev, displayName: nextDisplay, organization: nextOrg, language: nextLang }
            : prev,
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    },
    [user, profile],
  );

  const saveAnalysisSnapshot = useCallback(
    async (input: {
      scope: string;
      regionName: string;
      year: number;
      scenario: PersistedAnalysis['scenario'];
      summary: string;
    }) => {
      if (!user || !profile) return false;
      const uid = sanitizeFirestoreId(user.uid);
      const id = sanitizeFirestoreId(`ana-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      try {
        await setDoc(doc(db, 'analyses', id), {
          id,
          ownerUid: uid,
          roleTag: profile.role,
          scope: clampText(input.scope, BLUEPRINT_LIMITS.scopeMaxLength),
          regionName: clampText(input.regionName, BLUEPRINT_LIMITS.regionNameMaxLength),
          year: Math.min(2035, Math.max(2026, Number(input.year) || 2027)),
          scenario: input.scenario,
          summary: clampText(input.summary, BLUEPRINT_LIMITS.summaryMaxLength),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return true;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `analyses/${id}`);
      }
    },
    [user, profile],
  );

  const deleteSavedAnalysis = useCallback(async (id: string) => {
    const cleanId = sanitizeFirestoreId(id);
    try {
      await deleteDoc(doc(db, 'analyses', cleanId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `analyses/${cleanId}`);
    }
  }, []);

  const saveChatInteraction = useCallback(
    async (input: {
      roleId: PersistedChatLog['roleId'];
      zoneName: string;
      prompt: string;
      reply: string;
    }) => {
      if (!user) return;
      const uid = sanitizeFirestoreId(user.uid);
      const id = sanitizeFirestoreId(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      try {
        await setDoc(doc(db, 'chat_logs', id), {
          id,
          ownerUid: uid,
          roleId: input.roleId,
          zoneName: clampText(input.zoneName, BLUEPRINT_LIMITS.regionNameMaxLength, 'Madagascar'),
          prompt: clampText(input.prompt, BLUEPRINT_LIMITS.promptMaxLength),
          reply: clampText(input.reply, BLUEPRINT_LIMITS.replyMaxLength),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `chat_logs/${id}`);
      }
    },
    [user],
  );

  const saveSyncSnapshot = useCallback(
    async (input: {
      triggeredBy: 'manual' | 'midnight-cron';
      midnightEnabled: boolean;
      oniIndex: number;
      countriesUpdated: number;
      scrapedSourcesCount: number;
      summary: string;
    }) => {
      if (!user) return;
      const uid = sanitizeFirestoreId(user.uid);
      const id = sanitizeFirestoreId(`sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      try {
        await setDoc(doc(db, 'sync_snapshots', id), {
          id,
          ownerUid: uid,
          triggeredBy: input.triggeredBy === 'midnight-cron' ? 'midnight-cron' : 'manual',
          midnightEnabled: Boolean(input.midnightEnabled),
          oniIndex: Math.max(-5, Math.min(8, Number(input.oniIndex) || 3.5)),
          countriesUpdated: Math.max(1, Math.min(250, Math.round(Number(input.countriesUpdated) || 195))),
          scrapedSourcesCount: Math.max(0, Math.min(50, Math.round(Number(input.scrapedSourcesCount) || 0))),
          summary: clampText(input.summary, BLUEPRINT_LIMITS.summaryMaxLength),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `sync_snapshots/${id}`);
      }
    },
    [user],
  );

  const createCooperativeDossier = useCallback(
    async (input: {
      cooperativeName: string;
      district: string;
      crop: string;
      requestedMUsd: number;
      submitImmediately?: boolean;
    }) => {
      if (!user) return;
      const uid = sanitizeFirestoreId(user.uid);
      const id = sanitizeFirestoreId(`coop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      const amount = Math.max(0, Math.min(BLUEPRINT_LIMITS.maxRequestedMUsd, Number(input.requestedMUsd) || 0));
      try {
        await setDoc(doc(db, 'cooperative_dossiers', id), {
          id,
          ownerUid: uid,
          cooperativeName: clampText(input.cooperativeName, BLUEPRINT_LIMITS.cooperativeNameMaxLength),
          district: clampText(input.district, BLUEPRINT_LIMITS.districtMaxLength),
          crop: clampText(input.crop, BLUEPRINT_LIMITS.cropMaxLength),
          requestedMUsd: Number(amount.toFixed(3)),
          status: input.submitImmediately ? 'submitted' : 'draft',
          reviewNote: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `cooperative_dossiers/${id}`);
      }
    },
    [user],
  );

  const submitCooperativeDossier = useCallback(async (id: string) => {
    const cleanId = sanitizeFirestoreId(id);
    try {
      await updateDoc(doc(db, 'cooperative_dossiers', cleanId), {
        status: 'submitted',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cooperative_dossiers/${cleanId}`);
    }
  }, []);

  const reviewCooperativeDossier = useCallback(
    async (id: string, decision: 'approved' | 'rejected', reviewNote: string) => {
      const cleanId = sanitizeFirestoreId(id);
      try {
        await updateDoc(doc(db, 'cooperative_dossiers', cleanId), {
          status: decision,
          reviewNote: clampText(reviewNote, BLUEPRINT_LIMITS.reviewNoteMaxLength, 'Reviewed by M&G Consulting Direction'),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `cooperative_dossiers/${cleanId}`);
      }
    },
    [],
  );

  const deleteDraftDossier = useCallback(async (id: string) => {
    const cleanId = sanitizeFirestoreId(id);
    try {
      await deleteDoc(doc(db, 'cooperative_dossiers', cleanId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `cooperative_dossiers/${cleanId}`);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAdmin,
      authReady,
      authBusy,
      authError,
      savedAnalyses,
      chatLogs,
      dossiers,
      syncSnapshots,
      signInWithGoogle,
      signOutUser,
      updateWorkspaceProfile,
      saveAnalysisSnapshot,
      deleteSavedAnalysis,
      saveChatInteraction,
      saveSyncSnapshot,
      createCooperativeDossier,
      submitCooperativeDossier,
      reviewCooperativeDossier,
      deleteDraftDossier,
    }),
    [
      user,
      profile,
      isAdmin,
      authReady,
      authBusy,
      authError,
      savedAnalyses,
      chatLogs,
      dossiers,
      syncSnapshots,
      signInWithGoogle,
      signOutUser,
      updateWorkspaceProfile,
      saveAnalysisSnapshot,
      deleteSavedAnalysis,
      saveChatInteraction,
      saveSyncSnapshot,
      createCooperativeDossier,
      submitCooperativeDossier,
      reviewCooperativeDossier,
      deleteDraftDossier,
    ],
  );

  return (
    <FirebaseErrorBoundary>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </FirebaseErrorBoundary>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
