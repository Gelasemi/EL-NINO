import { useState } from 'react';
import {
  CheckCircle2,
  Database,
  FileCheck2,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  Send,
  Shield,
  Trash2,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, type WorldLanguageCode } from '../i18n/LanguageContext';

type WorkspaceTab = 'profile' | 'analyses' | 'chats' | 'dossiers';

interface WorkspaceCopy {
  title: string;
  subtitle: string;
  signInBtn: string;
  signOutBtn: string;
  signInPrompt: string;
  roleLabels: Record<'director' | 'analyst' | 'cooperative', string>;
  tabs: Record<WorkspaceTab, string>;
  displayNameLbl: string;
  orgLbl: string;
  saveProfileBtn: string;
  savedBadge: string;
  noItems: string;
  newDossierTitle: string;
  coopNamePh: string;
  districtPh: string;
  cropPh: string;
  amountPh: string;
  createDraftBtn: string;
  submitNowBtn: string;
  approveBtn: string;
  rejectBtn: string;
  reviewNotePh: string;
  statusLabels: Record<'draft' | 'submitted' | 'approved' | 'rejected', string>;
}

const WORKSPACE_COPY: Record<'fr' | 'en' | 'es' | 'ar' | 'zh' | 'pt' | 'hi' | 'ru' | 'sw', WorkspaceCopy> = {
  fr: {
    title: 'Espace Collaboratif, Comptes & Persistance Base de Données',
    subtitle: 'Authentification Google, contrôle d’accès par rôle (Direction M&G Consulting · Analyste · Coopérative) et historique Firestore.',
    signInBtn: 'Connexion Google',
    signOutBtn: 'Déconnexion',
    signInPrompt: 'Connectez-vous avec Google pour sauvegarder vos analyses ENSO, historiques Gemini et dossiers de financement coopératifs.',
    roleLabels: {
      director: 'Direction M&G Consulting (Admin)',
      analyst: 'Analyste Climat & Économie',
      cooperative: 'Coopérative Agricole / FDA-R',
    },
    tabs: {
      profile: 'Profil & Rôle',
      analyses: 'Analyses sauvegardées',
      chats: 'Historique IA / Babakoto',
      dossiers: 'Dossiers Coopératives',
    },
    displayNameLbl: 'Nom complet',
    orgLbl: 'Organisation / Coopérative',
    saveProfileBtn: 'Mettre à jour le profil',
    savedBadge: 'Enregistré',
    noItems: 'Aucun enregistrement persisté pour le moment.',
    newDossierTitle: 'Nouveau dossier d’adaptation climatique (FDA-R / DEFIS)',
    coopNamePh: 'Nom de la coopérative (ex. Coop. Andriamboay)',
    districtPh: 'District (ex. Ambovombe)',
    cropPh: 'Filière (ex. Sorgho 90j / Riz)',
    amountPh: 'Montant (M USD)',
    createDraftBtn: 'Enregistrer brouillon',
    submitNowBtn: 'Soumettre pour validation',
    approveBtn: 'Approuver',
    rejectBtn: 'Refuser',
    reviewNotePh: 'Note de décision Direction M&G Consulting...',
    statusLabels: {
      draft: 'Brouillon',
      submitted: 'Soumis',
      approved: 'Approuvé',
      rejected: 'Refusé',
    },
  },
  en: {
    title: 'Collaborative Workspace, Accounts & Database Persistence',
    subtitle: 'Google Sign-In, role-based access control (M&G Consulting Direction · Analyst · Cooperative) and real-time Firestore storage.',
    signInBtn: 'Sign in with Google',
    signOutBtn: 'Sign out',
    signInPrompt: 'Sign in with Google to persist your ENSO analyses, Gemini conversation logs, and cooperative adaptation grant dossiers.',
    roleLabels: {
      director: 'M&G Consulting Direction (Admin)',
      analyst: 'Climate & Economic Analyst',
      cooperative: 'Agricultural Cooperative / FDA-R',
    },
    tabs: {
      profile: 'Profile & Role',
      analyses: 'Saved Analyses',
      chats: 'AI / Babakoto Logs',
      dossiers: 'Cooperative Dossiers',
    },
    displayNameLbl: 'Full name',
    orgLbl: 'Organization / Cooperative',
    saveProfileBtn: 'Update profile',
    savedBadge: 'Saved',
    noItems: 'No persisted records yet.',
    newDossierTitle: 'New Climate Adaptation Dossier (FDA-R / DEFIS)',
    coopNamePh: 'Cooperative name',
    districtPh: 'District (e.g. Ambovombe)',
    cropPh: 'Crop value chain (e.g. Sorghum / Rice)',
    amountPh: 'Requested (M USD)',
    createDraftBtn: 'Save draft',
    submitNowBtn: 'Submit for review',
    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    reviewNotePh: 'M&G Consulting review note...',
    statusLabels: {
      draft: 'Draft',
      submitted: 'Submitted',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
  es: {
    title: 'Espacio Colaborativo, Cuentas y Base de Datos',
    subtitle: 'Inicio de sesión Google, control de acceso por roles (Dirección M&G Consulting · Analista · Cooperativa) y Firestore.',
    signInBtn: 'Iniciar sesión con Google',
    signOutBtn: 'Cerrar sesión',
    signInPrompt: 'Inicie sesión con Google para guardar sus análisis ENSO, historiales de IA y expedientes cooperativos.',
    roleLabels: {
      director: 'Dirección M&G Consulting (Admin)',
      analyst: 'Analista Climático y Económico',
      cooperative: 'Cooperativa Agrícola',
    },
    tabs: {
      profile: 'Perfil y Rol',
      analyses: 'Análisis Guardados',
      chats: 'Historial IA',
      dossiers: 'Expedientes Cooperativos',
    },
    displayNameLbl: 'Nombre completo',
    orgLbl: 'Organización / Cooperativa',
    saveProfileBtn: 'Actualizar perfil',
    savedBadge: 'Guardado',
    noItems: 'No hay registros guardados todavía.',
    newDossierTitle: 'Nuevo Expediente de Adaptación Climática',
    coopNamePh: 'Nombre de la cooperativa',
    districtPh: 'Distrito (ej. Ambovombe)',
    cropPh: 'Cultivo (ej. Sorgo / Arroz)',
    amountPh: 'Monto (M USD)',
    createDraftBtn: 'Guardar borrador',
    submitNowBtn: 'Enviar a revisión',
    approveBtn: 'Aprobar',
    rejectBtn: 'Rechazar',
    reviewNotePh: 'Nota de revisión M&G Consulting...',
    statusLabels: {
      draft: 'Borrador',
      submitted: 'Enviado',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    },
  },
  ar: {
    title: 'مساحة العمل المشتركة والحسابات وقاعدة البيانات',
    subtitle: 'تسجيل الدخول عبر Google، والتحكم في الوصول حسب الدور (إدارة M&G Consulting · محلل · تعاونية) وتخزين Firestore.',
    signInBtn: 'تسجيل الدخول عبر Google',
    signOutBtn: 'تسجيل الخروج',
    signInPrompt: 'سجّل الدخول بحساب Google لحفظ تحليلات النينيو، وسجلات المحادثات، وملفات التمويل التعاوني.',
    roleLabels: {
      director: 'إدارة M&G Consulting (مشرف)',
      analyst: 'محلل مناخي واقتصادي',
      cooperative: 'تعاونية زراعية',
    },
    tabs: {
      profile: 'الملف والدور',
      analyses: 'التحليلات المحفوظة',
      chats: 'سجل محادثات الذكاء الاصطناعي',
      dossiers: 'ملفات التعاونيات',
    },
    displayNameLbl: 'الاسم الكامل',
    orgLbl: 'المؤسسة / التعاونية',
    saveProfileBtn: 'تحديث الملف الشخصي',
    savedBadge: 'تم الحفظ',
    noItems: 'لا توجد سجلات محفوظة بعد.',
    newDossierTitle: 'ملف تمويل جديد للتكيف المناخي',
    coopNamePh: 'اسم التعاونية',
    districtPh: 'المنطقة (مثال: Ambovombe)',
    cropPh: 'المحصول (مثال: الذرة / الأرز)',
    amountPh: 'المبلغ المطلوب (مليون دولار)',
    createDraftBtn: 'حفظ كمسودة',
    submitNowBtn: 'إرسال للمراجعة',
    approveBtn: 'اعتماد',
    rejectBtn: 'رفض',
    reviewNotePh: 'ملاحظة المراجعة الإدارية...',
    statusLabels: {
      draft: 'مسودة',
      submitted: 'مُرسل',
      approved: 'معتمد',
      rejected: 'مرفوض',
    },
  },
  zh: {
    title: '协同工作区、账户与数据库持久化',
    subtitle: 'Google 登录、基于角色的访问控制（M&G Consulting 管理层 · 分析师 · 合作社）及 Firestore 实时存储。',
    signInBtn: '使用 Google 登录',
    signOutBtn: '退出登录',
    signInPrompt: '使用 Google 登录以保存您的 ENSO 分析、AI 对话记录和合作社气候适应融资档案。',
    roleLabels: {
      director: 'M&G Consulting 管理层 (管理员)',
      analyst: '气候与经济分析师',
      cooperative: '农业合作社 / FDA-R',
    },
    tabs: {
      profile: '个人资料与角色',
      analyses: '已保存分析',
      chats: 'AI 对话记录',
      dossiers: '合作社档案',
    },
    displayNameLbl: '姓名',
    orgLbl: '机构 / 合作社',
    saveProfileBtn: '更新资料',
    savedBadge: '已保存',
    noItems: '暂无持久化记录。',
    newDossierTitle: '新建气候适应融资档案',
    coopNamePh: '合作社名称',
    districtPh: '地区（如 Ambovombe）',
    cropPh: '作物（如 高粱 / 水稻）',
    amountPh: '申请金额 (百万美元)',
    createDraftBtn: '保存草稿',
    submitNowBtn: '提交审核',
    approveBtn: '批准',
    rejectBtn: '驳回',
    reviewNotePh: 'M&G Consulting 审核意见...',
    statusLabels: {
      draft: '草稿',
      submitted: '已提交',
      approved: '已批准',
      rejected: '已驳回',
    },
  },
  pt: {
    title: 'Espaço Colaborativo, Contas e Persistência de Dados',
    subtitle: 'Login Google, controle de acesso por função (Direção M&G Consulting · Analista · Cooperativa) e Firestore.',
    signInBtn: 'Entrar com Google',
    signOutBtn: 'Sair',
    signInPrompt: 'Entre com o Google para salvar suas análises ENSO, históricos de IA e dossiês cooperativos.',
    roleLabels: {
      director: 'Direção M&G Consulting (Admin)',
      analyst: 'Analista Climático e Econômico',
      cooperative: 'Cooperativa Agrícola',
    },
    tabs: {
      profile: 'Perfil e Função',
      analyses: 'Análises Salvas',
      chats: 'Histórico IA',
      dossiers: 'Dossiês Cooperativos',
    },
    displayNameLbl: 'Nome completo',
    orgLbl: 'Organização / Cooperativa',
    saveProfileBtn: 'Atualizar perfil',
    savedBadge: 'Salvo',
    noItems: 'Nenhum registro salvo ainda.',
    newDossierTitle: 'Novo Dossiê de Adaptação Climática',
    coopNamePh: 'Nome da cooperativa',
    districtPh: 'Distrito (ex. Ambovombe)',
    cropPh: 'Cultura (ex. Sorgo / Arroz)',
    amountPh: 'Valor (M USD)',
    createDraftBtn: 'Salvar rascunho',
    submitNowBtn: 'Enviar para validação',
    approveBtn: 'Aprovar',
    rejectBtn: 'Rejeitar',
    reviewNotePh: 'Nota de decisão M&G Consulting...',
    statusLabels: {
      draft: 'Rascunho',
      submitted: 'Enviado',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    },
  },
  hi: {
    title: 'सहयोगी कार्यक्षेत्र, खाते और डेटाबेस स्टोरेज',
    subtitle: 'Google साइन-इन, भूमिका-आधारित पहुंच (M&G Consulting प्रबंधन · विश्लेषक · सहकारी समिति) और Firestore।',
    signInBtn: 'Google से साइन इन करें',
    signOutBtn: 'साइन आउट',
    signInPrompt: 'अपने ENSO विश्लेषण, AI चैट लॉग और सहकारी अनुदान डोजियर सहेजने के लिए Google से साइन इन करें।',
    roleLabels: {
      director: 'M&G Consulting प्रबंधन (एडमिन)',
      analyst: 'जलवायु एवं आर्थिक विश्लेषक',
      cooperative: 'कृषि सहकारी समिति',
    },
    tabs: {
      profile: 'प्रोफ़ाइल और भूमिका',
      analyses: 'सहेजे गए विश्लेषण',
      chats: 'AI चैट इतिहास',
      dossiers: 'सहकारी डोजियर',
    },
    displayNameLbl: 'पूरा नाम',
    orgLbl: 'संगठन / सहकारी समिति',
    saveProfileBtn: 'प्रोफ़ाइल अपडेट करें',
    savedBadge: 'सहेजा गया',
    noItems: 'अभी तक कोई सहेजा गया रिकॉर्ड नहीं है।',
    newDossierTitle: 'नया जलवायु अनुकूलन डोजियर',
    coopNamePh: 'सहकारी समिति का नाम',
    districtPh: 'जिला (उदा. Ambovombe)',
    cropPh: 'फसल (उदा. ज्वार / चावल)',
    amountPh: 'राशि (M USD)',
    createDraftBtn: 'ड्राफ़्ट सहेजें',
    submitNowBtn: 'समीक्षा के लिए भेजें',
    approveBtn: 'स्वीकृत करें',
    rejectBtn: 'अस्वीकार करें',
    reviewNotePh: 'समीक्षा टिप्पणी...',
    statusLabels: {
      draft: 'ड्राफ़्ट',
      submitted: 'प्रस्तुत',
      approved: 'स्वीकृत',
      rejected: 'अस्वीकृत',
    },
  },
  ru: {
    title: 'Совместная работа, аккаунты и база данных',
    subtitle: 'Вход через Google, ролевой доступ (Руководство M&G Consulting · Аналитик · Кооператив) и Firestore.',
    signInBtn: 'Войти через Google',
    signOutBtn: 'Выйти',
    signInPrompt: 'Войдите через Google, чтобы сохранять анализы Эль-Ниньо, историю чатов ИИ и заявки кооперативов.',
    roleLabels: {
      director: 'Руководство M&G Consulting (Админ)',
      analyst: 'Климатический и экономический аналитик',
      cooperative: 'Сельхозкооператив / FDA-R',
    },
    tabs: {
      profile: 'Профиль и роль',
      analyses: 'Сохранённые анализы',
      chats: 'История ИИ-чатов',
      dossiers: 'Заявки кооперативов',
    },
    displayNameLbl: 'Полное имя',
    orgLbl: 'Организация / Кооператив',
    saveProfileBtn: 'Обновить профиль',
    savedBadge: 'Сохранено',
    noItems: 'Сохранённых записей пока нет.',
    newDossierTitle: 'Новая заявка на климатическую адаптацию',
    coopNamePh: 'Название кооператива',
    districtPh: 'Район (напр. Ambovombe)',
    cropPh: 'Культура (напр. Сорго / Рис)',
    amountPh: 'Сумма (млн USD)',
    createDraftBtn: 'Сохранить черновик',
    submitNowBtn: 'Отправить на проверку',
    approveBtn: 'Одобрить',
    rejectBtn: 'Отклонить',
    reviewNotePh: 'Комментарий руководства M&G Consulting...',
    statusLabels: {
      draft: 'Черновик',
      submitted: 'Отправлено',
      approved: 'Одобрено',
      rejected: 'Отклонено',
    },
  },
  sw: {
    title: 'Eneo la Ushirikiano, Akaunti na Hifadhidata',
    subtitle: 'Ingia na Google, udhibiti wa majukumu (Uongozi wa M&G Consulting · Mchambuzi · Ushirika) na Firestore.',
    signInBtn: 'Ingia na Google',
    signOutBtn: 'Toka',
    signInPrompt: 'Ingia na Google ili kuhifadhi uchambuzi wa ENSO, historia ya mazungumzo ya AI na majalada ya ushirika.',
    roleLabels: {
      director: 'Uongozi wa M&G Consulting (Admin)',
      analyst: 'Mchambuzi wa Tabianchi na Uchumi',
      cooperative: 'Ushirika wa Kilimo / FDA-R',
    },
    tabs: {
      profile: 'Wasifu na Jukumu',
      analyses: 'Uchambuzi Uliohifadhiwa',
      chats: 'Historia ya AI',
      dossiers: 'Majalada ya Ushirika',
    },
    displayNameLbl: 'Jina kamili',
    orgLbl: 'Shirika / Ushirika',
    saveProfileBtn: 'Sasisha wasifu',
    savedBadge: 'Imehifadhiwa',
    noItems: 'Hakuna kumbukumbu zilizohifadhiwa bado.',
    newDossierTitle: 'Jalada Jipya la Kukabiliana na Tabianchi',
    coopNamePh: 'Jina la ushirika',
    districtPh: 'Wilaya (mf. Ambovombe)',
    cropPh: 'Zao (mf. Mtama / Mpunga)',
    amountPh: 'Kiasi (M USD)',
    createDraftBtn: 'Hifadhi rasimu',
    submitNowBtn: 'Wasilisha kwa ukaguzi',
    approveBtn: 'Idhinisha',
    rejectBtn: 'Kataa',
    reviewNotePh: 'Maelezo ya uamuzi wa M&G Consulting...',
    statusLabels: {
      draft: 'Rasimu',
      submitted: 'Imewasilishwa',
      approved: 'Imeidhinishwa',
      rejected: 'Imekataliwa',
    },
  },
};

export function ObservatoryWorkspaceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { worldLang } = useLanguage();
  const copy = WORKSPACE_COPY[worldLang];
  const {
    user,
    profile,
    isAdmin,
    authBusy,
    authError,
    savedAnalyses,
    chatLogs,
    dossiers,
    signInWithGoogle,
    signOutUser,
    updateWorkspaceProfile,
    deleteSavedAnalysis,
    createCooperativeDossier,
    submitCooperativeDossier,
    reviewCooperativeDossier,
    deleteDraftDossier,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('profile');
  const [nameInput, setNameInput] = useState('');
  const [orgInput, setOrgInput] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const [coopName, setCoopName] = useState('');
  const [coopDistrict, setCoopDistrict] = useState('Ambovombe');
  const [coopCrop, setCoopCrop] = useState('Sorgho 90j / Mil');
  const [coopAmount, setCoopAmount] = useState('0.25');
  const [reviewNoteMap, setReviewNoteMap] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleSaveProfile = async () => {
    await updateWorkspaceProfile({
      displayName: nameInput.trim() || profile?.displayName,
      organization: orgInput.trim() || profile?.organization,
      language: worldLang as WorldLanguageCode,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleCreateDossier = async (submitImmediately: boolean) => {
    if (!coopName.trim()) return;
    await createCooperativeDossier({
      cooperativeName: coopName,
      district: coopDistrict,
      crop: coopCrop,
      requestedMUsd: Number(coopAmount) || 0.1,
      submitImmediately,
    });
    setCoopName('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 backdrop-blur-xs sm:p-6"
    >
      <div className="flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-[#F9F8F4] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <Database className="mt-1 h-5 w-5 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
            <div>
              <h2 className="font-serif text-lg font-bold text-zinc-900 sm:text-xl">
                {copy.title}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-600">{copy.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {authError && (
            <div className="rounded border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900">
              {authError}
            </div>
          )}

          {!user ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
              <Shield className="mx-auto h-10 w-10 text-[#1E3A8A]" aria-hidden="true" />
              <p className="mx-auto mt-3 max-w-md text-sm text-zinc-700">{copy.signInPrompt}</p>
              <button
                type="button"
                disabled={authBusy}
                onClick={signInWithGoogle}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#172554] disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>{copy.signInBtn}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Active User & Role Bar */}
              <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1E3A8A] text-white">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-zinc-900">
                        {profile?.displayName || user.displayName}
                      </span>
                      <span className="rounded border border-[#1E3A8A]/30 bg-[#1E3A8A]/8 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1E3A8A]">
                        {copy.roleLabels[profile?.role ?? (isAdmin ? 'director' : 'analyst')]}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {profile?.organization} · {user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={signOutUser}
                  className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.signOutBtn}</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2.5">
                {(
                  [
                    { id: 'profile', icon: User, count: null },
                    { id: 'analyses', icon: Database, count: savedAnalyses.length },
                    { id: 'chats', icon: MessageSquare, count: chatLogs.length },
                    { id: 'dossiers', icon: FileCheck2, count: dossiers.length },
                  ] as const
                ).map(({ id, icon: Icon, count }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeTab === id
                        ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.tabs[id]}</span>
                    {count !== null && (
                      <span className="font-mono text-[10px] opacity-80">({count})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab 1: Profile */}
              {activeTab === 'profile' && (
                <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        {copy.displayNameLbl}
                      </label>
                      <input
                        type="text"
                        value={nameInput || profile?.displayName || ''}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        {copy.orgLbl}
                      </label>
                      <input
                        type="text"
                        value={orgInput || profile?.organization || ''}
                        onChange={(e) => setOrgInput(e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172554]"
                    >
                      {copy.saveProfileBtn}
                    </button>
                    {profileSaved && (
                      <span className="text-xs font-semibold text-emerald-700">
                        {copy.savedBadge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Saved Analyses */}
              {activeTab === 'analyses' && (
                <div className="space-y-2.5">
                  {savedAnalyses.length === 0 ? (
                    <p className="rounded border border-zinc-200 bg-white p-5 text-center text-xs text-zinc-500">
                      {copy.noItems}
                    </p>
                  ) : (
                    savedAnalyses.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 text-xs"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-zinc-900">{item.regionName}</span>
                            <span className="font-mono text-[11px] text-[#1E3A8A]">
                              {item.scope} · {item.year} · {item.scenario.toUpperCase()}
                            </span>
                          </div>
                          <p className="mt-1 leading-relaxed text-zinc-600">{item.summary}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSavedAnalysis(item.id)}
                          className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-700"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Chat Logs */}
              {activeTab === 'chats' && (
                <div className="space-y-2.5">
                  {chatLogs.length === 0 ? (
                    <p className="rounded border border-zinc-200 bg-white p-5 text-center text-xs text-zinc-500">
                      {copy.noItems}
                    </p>
                  ) : (
                    chatLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border border-zinc-200 bg-white p-3.5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                          <span>
                            {log.zoneName} · {log.roleId}
                          </span>
                        </div>
                        <p className="font-semibold text-zinc-900">{log.prompt}</p>
                        <p className="leading-relaxed text-zinc-700">{log.reply}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 4: Cooperative Dossiers */}
              {activeTab === 'dossiers' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
                    <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-800">
                      <Plus className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                      <span>{copy.newDossierTitle}</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                      <input
                        type="text"
                        value={coopName}
                        onChange={(e) => setCoopName(e.target.value)}
                        placeholder={copy.coopNamePh}
                        className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs sm:col-span-2"
                      />
                      <input
                        type="text"
                        value={coopDistrict}
                        onChange={(e) => setCoopDistrict(e.target.value)}
                        placeholder={copy.districtPh}
                        className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="number"
                        step="0.05"
                        min="0.01"
                        max="500"
                        value={coopAmount}
                        onChange={(e) => setCoopAmount(e.target.value)}
                        placeholder={copy.amountPh}
                        className="rounded border border-zinc-300 px-2.5 py-1.5 font-mono text-xs"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={coopCrop}
                        onChange={(e) => setCoopCrop(e.target.value)}
                        placeholder={copy.cropPh}
                        className="rounded border border-zinc-300 px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleCreateDossier(false)}
                        className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
                      >
                        {copy.createDraftBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateDossier(true)}
                        className="inline-flex items-center gap-1 rounded bg-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#172554]"
                      >
                        <Send className="h-3 w-3" aria-hidden="true" />
                        <span>{copy.submitNowBtn}</span>
                      </button>
                    </div>
                  </div>

                  {dossiers.length === 0 ? (
                    <p className="rounded border border-zinc-200 bg-white p-5 text-center text-xs text-zinc-500">
                      {copy.noItems}
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {dossiers.map((dos) => (
                        <div
                          key={dos.id}
                          className="rounded-lg border border-zinc-200 bg-white p-3.5 text-xs space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold text-zinc-900">
                                {dos.cooperativeName}
                              </span>
                              <span className="ml-2 text-zinc-500">
                                {dos.district} · {dos.crop} ·{' '}
                                <strong className="font-mono text-[#1E3A8A]">
                                  ${dos.requestedMUsd.toFixed(2)}M
                                </strong>
                              </span>
                            </div>
                            <span
                              className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
                                dos.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : dos.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : dos.status === 'submitted'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {copy.statusLabels[dos.status]}
                            </span>
                          </div>

                          {dos.reviewNote && (
                            <p className="text-[11px] text-zinc-600">{dos.reviewNote}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-2">
                            {dos.status === 'draft' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => submitCooperativeDossier(dos.id)}
                                  className="rounded bg-[#1E3A8A] px-2.5 py-1 text-[11px] font-semibold text-white"
                                >
                                  {copy.submitNowBtn}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteDraftDossier(dos.id)}
                                  className="rounded border border-zinc-300 px-2.5 py-1 text-[11px] text-rose-700 hover:bg-rose-50"
                                >
                                  <Trash2 className="inline h-3 w-3" />
                                </button>
                              </>
                            )}

                            {isAdmin && (dos.status === 'submitted' || dos.status === 'draft') && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  value={reviewNoteMap[dos.id] ?? ''}
                                  onChange={(e) =>
                                    setReviewNoteMap((prev) => ({
                                      ...prev,
                                      [dos.id]: e.target.value,
                                    }))
                                  }
                                  placeholder={copy.reviewNotePh}
                                  className="rounded border border-zinc-300 px-2 py-1 text-[11px]"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    reviewCooperativeDossier(
                                      dos.id,
                                      'approved',
                                      reviewNoteMap[dos.id] || 'Approved — FDA-R / M&G Consulting',
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>{copy.approveBtn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    reviewCooperativeDossier(
                                      dos.id,
                                      'rejected',
                                      reviewNoteMap[dos.id] || 'Needs revised district co-financing',
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded bg-rose-700 px-2.5 py-1 text-[11px] font-semibold text-white"
                                >
                                  <XCircle className="h-3 w-3" />
                                  <span>{copy.rejectBtn}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
