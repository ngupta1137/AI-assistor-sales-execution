// Multi-lingual UI Internationalization (PRD P2 & Point 4).
// Comprehensive translations for Spanish (es), French (fr), German (de), Portuguese (pt), Arabic (ar), Hindi (hi), and English (en).

export const UI_LANGUAGES = {
  en: { code: 'en', label: 'English', dir: 'ltr' },
  es: { code: 'es', label: 'Español', dir: 'ltr' },
  fr: { code: 'fr', label: 'Français', dir: 'ltr' },
  de: { code: 'de', label: 'Deutsch', dir: 'ltr' },
  pt: { code: 'pt', label: 'Português', dir: 'ltr' },
  ar: { code: 'ar', label: 'العربية', dir: 'rtl' },
  hi: { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
};

export const COUNTRY_DEFAULT_LANG = {
  US: 'en', UK: 'en', AU: 'en', NZ: 'en',
  MX: 'es', FR: 'fr', DE: 'de', BR: 'pt',
  AE: 'ar', IN: 'hi', ID: 'en',
};

const DICT = {
  // Navigation tabs
  'Today': {
    es: 'Hoy', fr: "Aujourd'hui", de: 'Heute', pt: 'Hoje', ar: 'اليوم', hi: 'आज',
  },
  'Brief': {
    es: 'Resumen', fr: 'Briefing', de: 'Briefing', pt: 'Resumo', ar: 'الملخص', hi: 'ब्रीफ़',
  },
  'Route': {
    es: 'Ruta', fr: 'Itinéraire', de: 'Route', pt: 'Rota', ar: 'المسار', hi: 'मार्ग',
  },
  'Companion': {
    es: 'Compañero', fr: 'Compagnon', de: 'Begleiter', pt: 'Companheiro', ar: 'المساعد', hi: 'साथी',
  },
  'Agents': {
    es: 'Agentes', fr: 'Agents', de: 'Agenten', pt: 'Agentes', ar: 'الوكلاء', hi: 'एजेंट',
  },
  'Config': {
    es: 'Configuración', fr: 'Configuration', de: 'Konfiguration', pt: 'Configuração', ar: 'الإعدادات', hi: 'कॉन्फ़िग',
  },
  'Team': {
    es: 'Equipo', fr: 'Équipe', de: 'Team', pt: 'Equipe', ar: 'الفريق', hi: 'टीम',
  },
  'System': {
    es: 'Sistema', fr: 'Système', de: 'System', pt: 'Sistema', ar: 'النظام', hi: 'सिस्टम',
  },
  'Health': {
    es: 'Salud', fr: 'Santé', de: 'Zustand', pt: 'Saúde', ar: 'الحالة', hi: 'स्वास्थ्य',
  },
  'Key Accounts': {
    es: 'Cuentas Clave', fr: 'Grands Comptes', de: 'Schlüsselkunden', pt: 'Contas-Chave', ar: 'الحسابات الرئيسية', hi: 'प्रमुख खाते',
  },
  'Partner': {
    es: 'Socio', fr: 'Partenaire', de: 'Partner', pt: 'Parceiro', ar: 'الشريك', hi: 'साझेदार',
  },
  'Executive': {
    es: 'Ejecutivo', fr: 'Direction', de: 'Vorstand', pt: 'Executivo', ar: 'الإدارة العليا', hi: 'कार्यकारी',
  },
  'Problems': {
    es: 'Problemas', fr: 'Problèmes', de: 'Probleme', pt: 'Problemas', ar: 'المشكلات', hi: 'समस्याएं',
  },

  // Setup screen
  'Industry': {
    es: 'Industria', fr: 'Secteur', de: 'Branche', pt: 'Indústria', ar: 'القطاع', hi: 'उद्योग',
  },
  'Country': {
    es: 'País', fr: 'Pays', de: 'Land', pt: 'País', ar: 'الدولة', hi: 'देश',
  },
  'Role': {
    es: 'Rol', fr: 'Rôle', de: 'Rolle', pt: 'Função', ar: 'الدور', hi: 'भूमिका',
  },
  'Language': {
    es: 'Idioma', fr: 'Langue', de: 'Sprache', pt: 'Idioma', ar: 'اللغة', hi: 'भाषा',
  },
  'Start demo': {
    es: 'Iniciar demostración', fr: 'Démarrer la démo', de: 'Demo starten', pt: 'Iniciar demonstração', ar: 'بدء العرض', hi: 'डेमो शुरू करें',
  },
  'Choose an industry and a country': {
    es: 'Elija una industria y un país', fr: 'Choisissez un secteur et un pays', de: 'Wählen Sie eine Branche und ein Land', pt: 'Escolha uma indústria e um país', ar: 'اختر قطاعاً ودولة', hi: 'उद्योग और देश चुनें',
  },
  'All names are fictional.': {
    es: 'Todos los nombres son ficticios.', fr: 'Tous les noms sont fictifs.', de: 'Alle Namen sind fiktiv.', pt: 'Todos os nomes são fictícios.', ar: 'جميع الأسماء خيالية.', hi: 'सभी नाम काल्पनिक हैं।',
  },
  'Plans each rep\'s day, ranks what to do in every visit, and shows what happened. Choose a scenario.': {
    es: 'Planifica el día de cada representante, clasifica qué hacer en cada visita y demuestra lo que sucedió. Elija un escenario.',
    fr: 'Planifie la journée de chaque commercial, classe les actions prioritaires de chaque visite et démontre les résultats. Choisissez un scénario.',
    de: 'Plant den Tag jedes Außendienstlers, priorisiert Aktionen in jedem Besuch und belegt die Ausführung. Wählen Sie ein Szenario.',
    pt: 'Planeja o dia de cada representante, classifica o que fazer em cada visita e comprova o que aconteceu. Escolha um cenário.',
    ar: 'يخطط ليوم كل مندوب، ويرتب أولويات كل زيارة، ويوثق النتائج. اختر سيناريو.',
    hi: 'प्रत्येक प्रतिनिधि के दिन की योजना बनाता है, हर विज़िट की प्राथमिकताओं को क्रमबद्ध करता है और परिणामों को प्रमाणित करता है। एक परिदृश्य चुनें।',
  },

  // Common UI actions
  'Approve': {
    es: 'Aprobar', fr: 'Approuver', de: 'Genehmigen', pt: 'Aprovar', ar: 'الموافقة', hi: 'स्वीकृत करें',
  },
  'Adjust': {
    es: 'Ajustar', fr: 'Ajuster', de: 'Anpassen', pt: 'Ajustar', ar: 'تعديل', hi: 'समायोजित करें',
  },
  'Override': {
    es: 'Anular', fr: 'Remplacer', de: 'Überstimmen', pt: 'Substituir', ar: 'تجاوز', hi: 'ओवरराइड',
  },
  'Draft Order': {
    es: 'Borrador de pedido', fr: 'Ébauche de commande', de: 'Bestellungsentwurf', pt: 'Rascunho de pedido', ar: 'مسودة الطلب', hi: 'ऑर्डर ड्राफ़्ट',
  },
  'Complete visit': {
    es: 'Completar visita', fr: 'Terminer la visite', de: 'Besuch abschließen', pt: 'Concluir visita', ar: 'إتمام الزيارة', hi: 'विज़िट पूर्ण करें',
  },
  'Save to CRM': {
    es: 'Guardar en CRM', fr: 'Enregistrer dans CRM', de: 'Im CRM speichern', pt: 'Salvar no CRM', ar: 'حفظ في CRM', hi: 'CRM में सहेजें',
  },
  'Saved to CRM': {
    es: 'Guardado en CRM', fr: 'Enregistré dans CRM', de: 'Im CRM gespeichert', pt: 'Salvo no CRM', ar: 'تم الحفظ في CRM', hi: 'CRM में सहेजा गया',
  },
  'Back to Today': {
    es: 'Volver a Hoy', fr: "Retour à Aujourd'hui", de: 'Zurück zu Heute', pt: 'Voltar para Hoje', ar: 'العودة إلى اليوم', hi: 'आज पर वापस जाएँ',
  },
  'Open brief': {
    es: 'Abrir resumen', fr: 'Ouvrir le briefing', de: 'Briefing öffnen', pt: 'Abrir resumo', ar: 'فتح الملخص', hi: 'ब्रीफ़ खोलें',
  },
  'Confirm': {
    es: 'Confirmar', fr: 'Confirmer', de: 'Bestätigen', pt: 'Confirmar', ar: 'تأكيد', hi: 'पुष्टि करें',
  },
  'Cancel': {
    es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ar: 'إلغاء', hi: 'रद्द करें',
  },
  'Close': {
    es: 'Cerrar', fr: 'Fermer', de: 'Schließen', pt: 'Fechar', ar: 'إغلاق', hi: 'बंद करें',
  },
  'Log out': {
    es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden', pt: 'Sair', ar: 'تسجيل الخروج', hi: 'लॉग आउट',
  },

  // Card outcomes & Governance
  'Suggest': {
    es: 'Sugerir', fr: 'Suggérer', de: 'Empfehlen', pt: 'Sugerir', ar: 'اقتراح', hi: 'सुझाव',
  },
  'Needs clarification': {
    es: 'Requiere aclaración', fr: 'Clarification requise', de: 'Klärung erforderlich', pt: 'Requer esclarecimento', ar: 'يحتاج إلى توضيح', hi: 'स्पष्टीकरण आवश्यक',
  },
  'Conflict': {
    es: 'Conflicto', fr: 'Conflit', de: 'Konflikt', pt: 'Conflito', ar: 'تعارض', hi: 'टकराव',
  },
  'Data is stale': {
    es: 'Dato desactualizado', fr: 'Données obsolètes', de: 'Veraltete Daten', pt: 'Dados desatualizados', ar: 'بيانات قديمة', hi: 'डेटा पुराना है',
  },
  'Not allowed': {
    es: 'No permitido', fr: 'Non autorisé', de: 'Nicht zulässig', pt: 'Não permitido', ar: 'غير مسموح', hi: 'अनुमति नहीं',
  },
  'Compliance escalation': {
    es: 'Escalamiento de cumplimiento', fr: 'Escalade conformité', de: 'Compliance-Eskalation', pt: 'Escalação de conformidade', ar: 'تصعيد الامتثال', hi: 'अनुपालन वृद्धि',
  },
  'High confidence': {
    es: 'Alta confianza', fr: 'Haute confiance', de: 'Hohe Zuversicht', pt: 'Alta confiança', ar: 'ثقة عالية', hi: 'उच्च विश्वास',
  },
  'Medium confidence': {
    es: 'Confianza media', fr: 'Confiance moyenne', de: 'Mittlere Zuversicht', pt: 'Confiança média', ar: 'ثقة متوسطة', hi: 'मध्यम विश्वास',
  },
  'Low confidence': {
    es: 'Baja confianza', fr: 'Faible confiance', de: 'Geringe Zuversicht', pt: 'Baixa confiança', ar: 'ثقة منخفضة', hi: 'कम विश्वास',
  },
  'Approved': {
    es: 'Aprobado', fr: 'Approuvé', de: 'Genehmigt', pt: 'Aprovado', ar: 'معتمد', hi: 'स्वीकृत',
  },
  'Pending': {
    es: 'Pendiente', fr: 'En attente', de: 'Ausstehend', pt: 'Pendente', ar: 'معلق', hi: 'लंबित',
  },
  'Held': {
    es: 'Retenido', fr: 'Bloqué', de: 'Gehalten', pt: 'Retido', ar: 'محتجز', hi: 'रोका गया',
  },
  'Done': {
    es: 'Hecho', fr: 'Terminé', de: 'Erledigt', pt: 'Concluído', ar: 'مكتمل', hi: 'पूर्ण',
  },

  // Enterprise shell
  'Enterprise Integration': {
    es: 'Integración Empresarial', fr: 'Intégration Entreprise', de: 'Unternehmensintegration', pt: 'Integração Empresarial', ar: 'التكامل المؤسسي', hi: 'उद्यम एकीकरण',
  },
  'Offline mode active. Local AES-256 encrypted storage.': {
    es: 'Modo sin conexión activo. Almacenamiento local cifrado AES-256.',
    fr: 'Mode hors ligne actif. Stockage local chiffré AES-256.',
    de: 'Offline-Modus aktiv. Lokaler AES-256-verschlüsselter Speicher.',
    pt: 'Modo offline ativo. Armazenamento local criptografado AES-256.',
    ar: 'وضع عدم الاتصال نشط. تخزين محلي مشفر بمعيار AES-256.',
    hi: 'ऑफ़लाइन मोड सक्रिय। स्थानीय AES-256 एन्क्रिप्टेड स्टोरेज।',
  },
  'Go online': {
    es: 'Conectar', fr: 'Se connecter', de: 'Online gehen', pt: 'Ficar online', ar: 'الاتصال بالإنترنت', hi: 'ऑनलाइन जाएँ',
  },
};

/**
 * Resolves current active UI language.
 */
export function getActiveLang(app, countryId) {
  if (app?.ui?.lang) return app.ui.lang;
  const q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null;
  if (q && UI_LANGUAGES[q]) return q;
  return COUNTRY_DEFAULT_LANG[countryId] || 'en';
}

/**
 * Translates a given English UI label or template string into target language.
 */
export function tr(key, lang = 'en') {
  if (!lang || lang === 'en' || !key) return key;
  return DICT[key]?.[lang] || key;
}

/**
 * Checks if language is right-to-left (e.g. Arabic).
 */
export function isRtl(lang) {
  return lang === 'ar';
}
