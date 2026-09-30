/**
 * Hub Digital CESAG - Source de Données Structurée
 * Centre Africain d'Études Supérieures en Gestion (CESAG)
 */

const CESAG_DATA = {
  institution: {
    name: "CESAG",
    fullName: "Centre Africain d'Études Supérieures en Gestion",
    city: "Dakar, Sénégal",
    slogan: "Bien plus qu'une business school, une vision de l'Afrique conquérante.",
    currentTerm: "Rentrée Académique 2025 - 2026",
    support: {
      email: "oscarkakpo@cesag.edu.sn",
      primaryContact: "Oscar KAKPO - Support Numérique",
      hours: {
        morning: "11h00 - 12h00",
        evening: "16h30 - 18h00",
        days: "Lundi au Vendredi"
      },
      responseTime: "24h à 48h ouvrées"
    }
  },

  announcements: [
    {
      id: "rentree-2025",
      type: "info",
      badge: "Rentrée 2025-2026",
      title: "Bienvenue aux nouveaux étudiants du CESAG !",
      message: "Activez vos comptes institutionnels (Office 365 et Moodle) dès votre inscription pour accéder à vos cours et plannings.",
      ctaText: "Guide de démarrage",
      ctaTarget: "#nouveau-etudiant",
      isDismissible: true
    },
    {
      id: "evaluation-moodle",
      type: "warning",
      badge: "Rappel Pédagogique",
      title: "Évaluation des enseignements sur Moodle",
      message: "L'évaluation anonyme des cours sur Moodle est obligatoire pour valider votre semestre et débloquer l'accès aux examens.",
      ctaText: "Accéder à Moodle",
      ctaLink: "https://formations.cesagonline.com",
      isDismissible: true
    }
  ],

  categories: [
    { id: "all", label: "Tous les services", icon: "fa-th-large" },
    { id: "etudier", label: "Étudier & Cours", icon: "fa-graduation-cap" },
    { id: "communiquer", label: "Communiquer & Collaborer", icon: "fa-comments" },
    { id: "travailler", label: "Travailler & Bureautique", icon: "fa-briefcase" },
    { id: "ia", label: "Intelligence Artificielle", icon: "fa-robot" },
    { id: "outils", label: "Boîte à Outils & Utilitaires", icon: "fa-toolbox" },
    { id: "assistance", label: "Aide & Support", icon: "fa-life-ring" }
  ],

  services: [
    {
      id: "office365",
      name: "Microsoft 365 / Office",
      category: "travailler",
      shortDesc: "Suite bureautique complète (Word, Excel, PowerPoint), OneDrive 1 To et messagerie Outlook.",
      url: "https://www.office.com",
      icon: "fab fa-microsoft",
      iconColor: "#0078D4",
      tag: "Compte Institutionnel",
      tagClass: "tag-essential",
      isEssential: true,
      isQuickAccess: true,
      priority: 1,
      keywords: ["office", "365", "word", "excel", "powerpoint", "onedrive", "outlook", "mail", "messagerie", "compte", "mot de passe", "bureau", "stockage", "documents"],
      actions: [
        { label: "Se connecter", url: "https://www.office.com", isExternal: true, isPrimary: true },
        { label: "Tutoriel d'installation", action: "openTutorial('install-office')", isPrimary: false }
      ]
    },
    {
      id: "moodle",
      name: "Moodle FOAD CESAG",
      category: "etudier",
      shortDesc: "Espace officiel d'apprentissage : supports de cours, devoirs, examens et évaluations obligatoires.",
      url: "https://formations.cesagonline.com",
      icon: "fas fa-graduation-cap",
      iconColor: "#F59E0B",
      tag: "Plateforme de Cours",
      tagClass: "tag-essential",
      isEssential: true,
      isQuickAccess: true,
      priority: 2,
      keywords: ["moodle", "cours", "foad", "formations", "enseignements", "examens", "devoirs", "evaluations", "notes", "profs", "syllabus"],
      actions: [
        { label: "Accéder à Moodle", url: "https://formations.cesagonline.com", isExternal: true, isPrimary: true },
        { label: "Mot de passe perdu", url: "https://formations.cesagonline.com/login/forgot_password.php", isExternal: true, isPrimary: false }
      ]
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      category: "communiquer",
      shortDesc: "Classes virtuelles, visioconférences, canaux d'échanges avec vos enseignants et groupes de travail.",
      url: "https://teams.microsoft.com",
      icon: "fas fa-users-rectangle",
      iconColor: "#464EB8",
      tag: "Classes Virtuelles",
      tagClass: "tag-essential",
      isEssential: true,
      isQuickAccess: true,
      priority: 3,
      keywords: ["teams", "visio", "classe virtuelle", "cours en ligne", "reunion", "groupe", "chat", "webinaire", "conference", "professeur"],
      actions: [
        { label: "Ouvrir Teams", url: "https://teams.microsoft.com", isExternal: true, isPrimary: true },
        { label: "Guide de connexion", action: "openProblem('teams-cours')", isPrimary: false }
      ]
    },
    {
      id: "bibliotheque",
      name: "Bibliothèque Numérique CESAG",
      category: "etudier",
      shortDesc: "Catalogue en ligne, bases de données de recherche, mémoires, thèses et ouvrages scientifiques.",
      url: "https://bibliotheque.cesag.sn/",
      icon: "fas fa-book-bookmark",
      iconColor: "#006747",
      tag: "Recherche & Documentation",
      tagClass: "tag-free",
      isEssential: true,
      isQuickAccess: true,
      priority: 4,
      keywords: ["bibliotheque", "livres", "theses", "memoires", "recherche", "ouvrages", "revues", "articles", "documentation", "sn"],
      actions: [
        { label: "Consulter le catalogue", url: "https://bibliotheque.cesag.sn/", isExternal: true, isPrimary: true }
      ]
    },
    {
      id: "futurelearn",
      name: "FutureLearn",
      category: "etudier",
      shortDesc: "Plateforme internationale de MOOCs. Certifications requises pour la validation de certains modules.",
      url: "https://www.futurelearn.com",
      icon: "fas fa-globe",
      iconColor: "#E11D48",
      tag: "Certification Obligatoire",
      tagClass: "tag-mandatory",
      isEssential: true,
      isQuickAccess: true,
      priority: 5,
      keywords: ["futurelearn", "mooc", "certification", "cours", "anglais", "modules", "en ligne", "international"],
      actions: [
        { label: "Accéder à FutureLearn", url: "https://www.futurelearn.com", isExternal: true, isPrimary: true }
      ]
    },
    {
      id: "support-direct",
      name: "Assistance & Support Informatique",
      category: "assistance",
      shortDesc: "Guichet d'aide pour vos comptes institutionnels, mots de passe, accès Moodle et licences.",
      url: "mailto:oscarkakpo@cesag.edu.sn",
      icon: "fas fa-headset",
      iconColor: "#006747",
      tag: "Assistance CESAG",
      tagClass: "tag-support",
      isEssential: true,
      isQuickAccess: true,
      priority: 6,
      keywords: ["support", "aide", "contact", "probleme", "panne", "mot de passe", "bloque", "email", "kakpo", "assistance", "technique"],
      actions: [
        { label: "Envoyer un email", url: "mailto:oscarkakpo@cesag.edu.sn", isExternal: true, isPrimary: true },
        { label: "Diagnostic rapide", action: "openProblem('contact-direct')", isPrimary: false }
      ]
    },
    {
      id: "notion",
      name: "Notion",
      category: "travailler",
      shortDesc: "Espace de travail tout-en-un : prise de notes, organisation de projets, plannings et wikis.",
      url: "https://notion.so",
      icon: "fas fa-clipboard-list",
      iconColor: "#000000",
      tag: "Productivité",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 10,
      keywords: ["notion", "notes", "organisation", "projets", "planning", "taches", "kanban", "wiki"],
      actions: [{ label: "Ouvrir Notion", url: "https://notion.so", isExternal: true, isPrimary: true }]
    },
    {
      id: "miro",
      name: "Miro",
      category: "communiquer",
      shortDesc: "Tableau blanc visuel collaboratif pour brainstorming, cartographies d'idées et schémas d'équipes.",
      url: "https://miro.com",
      icon: "fas fa-chart-pie",
      iconColor: "#FFD02F",
      tag: "Collaboration",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 11,
      keywords: ["miro", "tableau blanc", "whiteboard", "brainstorming", "diagramme", "mindmap", "collaboration", "equipe"],
      actions: [{ label: "Ouvrir Miro", url: "https://miro.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "onenote",
      name: "Microsoft OneNote",
      category: "travailler",
      shortDesc: "Prise de notes numériques manuscrites ou tapées, intégrée et synchronisée avec vos équipes Teams.",
      url: "https://www.onenote.com",
      icon: "fas fa-book-open",
      iconColor: "#7719AA",
      tag: "Inclus Office 365",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 12,
      keywords: ["onenote", "notes", "cahier", "microsoft", "teams", "cours", "revision", "manuscrit"],
      actions: [{ label: "Ouvrir OneNote", url: "https://www.onenote.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "zotero",
      name: "Zotero",
      category: "etudier",
      shortDesc: "Gestionnaire de références bibliographiques et générateur automatique de citations pour mémoires et thèses.",
      url: "https://zotero.org",
      icon: "fas fa-bookmark",
      iconColor: "#CC292B",
      tag: "Recherche / Open-source",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 13,
      keywords: ["zotero", "bibliographie", "citations", "references", "memoire", "these", "articles", "sources", "apa"],
      actions: [{ label: "Télécharger Zotero", url: "https://zotero.org", isExternal: true, isPrimary: true }]
    },
    {
      id: "canva",
      name: "Canva Pro Étudiant",
      category: "travailler",
      shortDesc: "Création graphique simplifiée pour exposés, présentations d'impact, CV et rapports académiques.",
      url: "https://canva.com",
      icon: "fas fa-palette",
      iconColor: "#00C4CC",
      tag: "Design & Présentation",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 14,
      keywords: ["canva", "design", "presentation", "diapositives", "slides", "infographie", "cv", "visuels", "graphisme"],
      actions: [{ label: "Ouvrir Canva", url: "https://canva.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "forest",
      name: "Forest App",
      category: "travailler",
      shortDesc: "Application de concentration gamifiée basée sur la technique Pomodoro pour booster votre discipline.",
      url: "https://forestapp.cc",
      icon: "fas fa-tree",
      iconColor: "#2F855A",
      tag: "Focus Pomodoro",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 15,
      keywords: ["forest", "pomodoro", "concentration", "focus", "temps", "etude", "productivite"],
      actions: [{ label: "Découvrir Forest", url: "https://forestapp.cc", isExternal: true, isPrimary: true }]
    },
    {
      id: "linkedin",
      name: "LinkedIn Pro & Réseau",
      category: "communiquer",
      shortDesc: "Réseau professionnel indispensable pour développer votre réseau, trouver des stages et valoriser vos diplômes.",
      url: "https://linkedin.com",
      icon: "fab fa-linkedin",
      iconColor: "#0A66C2",
      tag: "Carrière & Réseau",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 16,
      keywords: ["linkedin", "reseau", "emploi", "stage", "carriere", "cv", "alumni", "recrutement", "professionnel"],
      actions: [{ label: "Aller sur LinkedIn", url: "https://linkedin.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "duolingo",
      name: "Duolingo",
      category: "etudier",
      shortDesc: "Pratique quotidienne et ludique des langues étrangères (Anglais professionnel, Espagnol, etc.).",
      url: "https://duolingo.com",
      icon: "fas fa-language",
      iconColor: "#58CC02",
      tag: "Langues",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 17,
      keywords: ["duolingo", "anglais", "langues", "toeic", "toefl", "vocabulaire", "apprentissage"],
      actions: [{ label: "Pratiquer sur Duolingo", url: "https://duolingo.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "coursera",
      name: "Coursera",
      category: "etudier",
      shortDesc: "Cours universitaires et spécialisations certifiantes des plus grandes institutions mondiales.",
      url: "https://coursera.org",
      icon: "fas fa-university",
      iconColor: "#0056D2",
      tag: "Audit Gratuit",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 18,
      keywords: ["coursera", "mooc", "cours", "certificat", "universite", "google", "ibm", "data", "finance"],
      actions: [{ label: "Explorer Coursera", url: "https://coursera.org", isExternal: true, isPrimary: true }]
    },
    {
      id: "chatgpt",
      name: "ChatGPT (OpenAI)",
      category: "ia",
      shortDesc: "Assistant conversationnel polyvalent pour clarifier des notions, reformuler et structurer vos travaux.",
      url: "https://chat.openai.com",
      icon: "fas fa-comments",
      iconColor: "#10A37F",
      tag: "IA Générative",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 20,
      keywords: ["chatgpt", "openai", "ia", "intelligence artificielle", "redaction", "synthese", "prompt", "aide"],
      actions: [{ label: "Ouvrir ChatGPT", url: "https://chat.openai.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "gemini",
      name: "Google Gemini",
      category: "ia",
      shortDesc: "IA multimodale de Google connectée au web, idéale pour la synthèse de documents et la recherche actualisée.",
      url: "https://gemini.google.com",
      icon: "fab fa-google",
      iconColor: "#1A73E8",
      tag: "IA Multimodale",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 21,
      keywords: ["gemini", "google", "ia", "multimodal", "recherche", "documents", "analyse"],
      actions: [{ label: "Ouvrir Gemini", url: "https://gemini.google.com", isExternal: true, isPrimary: true }]
    },
    {
      id: "claude",
      name: "Claude (Anthropic)",
      category: "ia",
      shortDesc: "Assistant IA réputé pour sa précision d'analyse textuelle et sa capacité de traitement de très longs documents.",
      url: "https://claude.ai",
      icon: "fas fa-brain",
      iconColor: "#D97706",
      tag: "Analyse Longs Documents",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 22,
      keywords: ["claude", "anthropic", "ia", "documents", "analyse", "texte", "synthese", "memoire"],
      actions: [{ label: "Ouvrir Claude", url: "https://claude.ai", isExternal: true, isPrimary: true }]
    },
    {
      id: "perplexity",
      name: "Perplexity AI",
      category: "ia",
      shortDesc: "Moteur de recherche scientifique et académique boosté par l'IA fournissant des sources vérifiables.",
      url: "https://www.perplexity.ai",
      icon: "fas fa-search",
      iconColor: "#14B8A6",
      tag: "Recherche Sourcée",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 23,
      keywords: ["perplexity", "recherche", "sources", "ia", "citations", "bibliographie", "academique"],
      actions: [{ label: "Ouvrir Perplexity", url: "https://www.perplexity.ai", isExternal: true, isPrimary: true }]
    },
    {
      id: "copilot",
      name: "Microsoft Copilot",
      category: "ia",
      shortDesc: "Assistant IA intégré dans l'écosystème Windows et Office 365 pour vous aider dans vos rédactions.",
      url: "https://copilot.microsoft.com",
      icon: "fab fa-microsoft",
      iconColor: "#0078D4",
      tag: "Intégré Office",
      tagClass: "tag-free",
      isEssential: false,
      isQuickAccess: false,
      priority: 24,
      keywords: ["copilot", "microsoft", "ia", "office", "word", "excel", "windows"],
      actions: [{ label: "Ouvrir Copilot", url: "https://copilot.microsoft.com", isExternal: true, isPrimary: true }]
    }
  ],

  onboardingSteps: [
    {
      step: 1,
      title: "Activez votre compte Microsoft 365 & Messagerie",
      shortDesc: "Votre identifiant officiel CESAG (prenom.nom@cesag.edu.sn)",
      icon: "fab fa-microsoft",
      badge: "Indispensable",
      details: "Votre compte CESAG vous donne accès à la messagerie institutionnelle Outlook, à 1 To de stockage cloud OneDrive et à l'ensemble de la suite Office. C'est sur cet email que vous recevrez toutes les communications officielles de l'administration et de vos professeurs.",
      checklist: [
        "Connectez-vous sur portal.office.com avec vos identifiants provisoires transmis lors de l'inscription.",
        "Modifiez immédiatement votre mot de passe pour un mot de passe robuste (12+ caractères).",
        "Configurez l'application Microsoft Authenticator ou un numéro de secours pour sécuriser votre compte."
      ],
      action: { label: "Se connecter à Office 365", url: "https://www.office.com" }
    },
    {
      step: 2,
      title: "Accédez à votre espace de cours Moodle FOAD",
      shortDesc: "Votre campus numérique pédagogique",
      icon: "fas fa-graduation-cap",
      badge: "Pédagogie",
      details: "Moodle est la plateforme où sont déposés tous vos syllabus, supports de cours (slides, polycopiés, études de cas) et où vous devez soumettre vos devoirs et évaluations.",
      checklist: [
        "Rendez-vous sur formations.cesagonline.com avec votre adresse email CESAG.",
        "Vérifiez que vous êtes bien inscrit(e) à l'ensemble de vos cours du semestre.",
        "Notez bien : l'évaluation anonyme des enseignements en fin de module est obligatoire pour débloquer l'accès aux examens."
      ],
      action: { label: "Ouvrir Moodle FOAD", url: "https://formations.cesagonline.com" }
    },
    {
      step: 3,
      title: "Installez Microsoft Teams pour vos classes",
      shortDesc: "Visioconférences et travail en groupe",
      icon: "fas fa-users-rectangle",
      badge: "Collaboration",
      details: "Les cours en ligne, classes virtuelles et travaux dirigés à distance se déroulent sur Microsoft Teams. L'application est disponible gratuitement sur PC, Mac, tablette et smartphone.",
      checklist: [
        "Téléchargez l'application Teams de bureau ou mobile pour une meilleure fluidité.",
        "Connectez-vous avec votre adresse institutionnelle @cesag.edu.sn.",
        "Rejoignez les équipes de vos promotions et modules."
      ],
      action: { label: "Accéder à Teams", url: "https://teams.microsoft.com" }
    },
    {
      step: 4,
      title: "Explorez la Bibliothèque & FutureLearn",
      shortDesc: "Ressources documentaires et MOOCs obligatoires",
      icon: "fas fa-book-bookmark",
      badge: "Ressources",
      details: "Profitez de l'accès aux bases de données scientifiques de la bibliothèque du CESAG et préparez vos certifications obligatoires sur FutureLearn exigées dans votre cursus.",
      checklist: [
        "Consultez le portail de la bibliothèque pour vos mémoires et études de cas.",
        "Créez votre compte FutureLearn avec votre email CESAG pour la validation des modules certifiants."
      ],
      action: { label: "Portail Bibliothèque", url: "https://bibliotheque.cesag.sn/" }
    },
    {
      step: 5,
      title: "Identifiez vos contacts de Support",
      shortDesc: "Une équipe dédiée en cas de difficulté",
      icon: "fas fa-headset",
      badge: "Assistance",
      details: "Un problème de mot de passe, un compte bloqué ou une question d'accès ? Le support informatique est à votre disposition.",
      checklist: [
        "Support technique : oscarkakpo@cesag.edu.sn",
        "Permanences : Lundi au Vendredi de 11h-12h et 16h30-18h.",
        "Indiquez toujours votre Nom, Prénom et Promotion dans vos demandes."
      ],
      action: { label: "Contacter le support", url: "mailto:oscarkakpo@cesag.edu.sn" }
    }
  ],

  troubleshooting: [
    {
      id: "mdp-office",
      title: "J'ai oublié mon mot de passe Office 365 (Email / Teams)",
      icon: "fab fa-microsoft",
      severity: "info",
      summary: "Procédure de récupération officielle et modèle de demande",
      steps: [
        "Si vous avez activé la récupération automatique (2FA / numéro de secours), essayez de réinitialiser votre mot de passe directement sur la page de connexion Microsoft via le lien 'Mot de passe oublié ?'.",
        "Si la procédure automatique ne fonctionne pas, utilisez notre modèle d'email pré-rédigé pour contacter le Support Informatique.",
        "Le support réinitialisera votre compte et vous transmettra un mot de passe temporaire dans un délai de 24h à 48h ouvrées."
      ],
      ctaText: "Utiliser le modèle d'email de réinitialisation",
      ctaAction: "openEmailModal('email6')"
    },
    {
      id: "mdp-moodle",
      title: "J'ai oublié mon mot de passe Moodle",
      icon: "fas fa-graduation-cap",
      severity: "success",
      summary: "Réinitialisation instantanée et autonome 24h/24",
      steps: [
        "Rendez-vous sur la page officielle de réinitialisation de Moodle : formations.cesagonline.com/login/forgot_password.php",
        "Saisissez votre adresse email institutionnelle CESAG (ou votre nom d'utilisateur).",
        "Cliquez sur 'Rechercher'. Un lien de réinitialisation sécurisé vous sera instantanément envoyé sur votre boîte de réception Outlook CESAG.",
        "Ouvrez le lien reçu pour définir votre nouveau mot de passe."
      ],
      ctaText: "Lancer la réinitialisation Moodle",
      ctaUrl: "https://formations.cesagonline.com/login/forgot_password.php"
    },
    {
      id: "teams-cours",
      title: "Je n'arrive pas à rejoindre une classe ou réunion Teams",
      icon: "fas fa-video",
      severity: "warning",
      summary: "Vérifications rapides des identifiants et accès",
      steps: [
        "Vérifiez que vous êtes connecté(e) à Teams avec votre compte CESAG officiel (@cesag.edu.sn) et NON avec un compte Microsoft personnel (Hotmail, Gmail, etc.).",
        "Si le lien du cours ne s'ouvre pas dans l'application Teams de bureau, testez l'accès via votre navigateur web (Google Chrome ou Microsoft Edge recommandés) sur teams.microsoft.com.",
        "Vérifiez que vous avez bien rejoint l'équipe de votre promotion ou demandez le code d'équipe à votre délégué(e) ou enseignant."
      ],
      ctaText: "Ouvrir Teams Web",
      ctaUrl: "https://teams.microsoft.com"
    },
    {
      id: "install-office",
      title: "Comment télécharger et installer Office 365 sur mon PC/Mac ?",
      icon: "fas fa-download",
      severity: "info",
      summary: "Votre licence étudiante permet l'installation sur 5 appareils",
      steps: [
        "Connectez-vous sur www.office.com avec votre adresse email @cesag.edu.sn.",
        "En haut à droite de la page d'accueil, cliquez sur le bouton 'Installer les applications' (ou 'Applications Microsoft 365').",
        "Téléchargez le fichier d'installation (.exe sur Windows ou .pkg sur Mac).",
        "Exécutez le programme puis ouvrez une application (Word ou Excel) pour vous connecter avec vos identifiants CESAG et activer la licence."
      ],
      ctaText: "Aller sur Office.com",
      ctaUrl: "https://www.office.com"
    },
    {
      id: "evaluation-moodle",
      title: "L'évaluation des enseignements sur Moodle est bloquante",
      icon: "fas fa-clipboard-check",
      severity: "warning",
      summary: "Pourquoi et comment compléter cette obligation académique",
      steps: [
        "L'évaluation des cours sur Moodle est une obligation académique formelle au CESAG.",
        "Si vous n'avez pas rempli l'évaluation d'un module terminé, l'accès aux examens ou aux cours suivants peut être restreint.",
        "Cette démarche est 100% anonyme : vos professeurs n'ont accès aux retours statistiques consolidés qu'après la publication définitive des notes."
      ],
      ctaText: "Accéder à Moodle pour évaluer",
      ctaUrl: "https://formations.cesagonline.com"
    },
    {
      id: "contact-direct",
      title: "Mon problème n'est pas listé : Contacter l'assistance",
      icon: "fas fa-envelope-open-text",
      severity: "info",
      summary: "Envoyez une demande claire pour un traitement rapide",
      steps: [
        "Envoyez un email à oscarkakpo@cesag.edu.sn.",
        "Pour un traitement efficace, indiquez impérativement : Vos Nom et Prénom complets, votre Formation/Promotion (ex: Master 1 Finance), et une description précise avec captures d'écran si possible.",
        "Permanences : Lundi à Vendredi (11h-12h et 16h30-18h)."
      ],
      ctaText: "Écrire au support CESAG",
      ctaUrl: "mailto:oscarkakpo@cesag.edu.sn"
    }
  ],

  tutorials: [
    {
      id: "tuto-office-install",
      title: "Installer la suite Microsoft 365 sur son ordinateur",
      tool: "Microsoft 365",
      duration: "10 min",
      level: "Débutant",
      category: "Bureautique",
      icon: "fab fa-microsoft",
      summary: "Guide complet pour installer Word, Excel, PowerPoint et Outlook sur PC Windows et Mac avec votre compte étudiant gratuit.",
      steps: [
        { title: "Connexion au portail", desc: "Rendez-vous sur www.office.com et identifiez-vous avec votre adresse institutionnelle (@cesag.edu.sn)." },
        { title: "Téléchargement", desc: "Cliquez sur 'Installer les applications' en haut à droite, puis sélectionnez 'Applications Microsoft 365'." },
        { title: "Installation", desc: "Lancez le fichier d'installation téléchargé et suivez les instructions à l'écran." },
        { title: "Activation", desc: "Ouvrez Microsoft Word, connectez-vous avec vos identifiants CESAG pour débloquer toutes les fonctionnalités complètes." }
      ]
    },
    {
      id: "tuto-moodle-starter",
      title: "Prendre en main Moodle FOAD & soumettre ses devoirs",
      tool: "Moodle",
      duration: "8 min",
      level: "Débutant",
      category: "Pédagogie",
      icon: "fas fa-graduation-cap",
      summary: "Naviguer dans vos espaces de cours, consulter les documents déposés par vos enseignants et déposer vos travaux dans les délais impartis.",
      steps: [
        { title: "Tableau de bord", desc: "Consultez la liste de vos cours inscrits sur formations.cesagonline.com." },
        { title: "Ressources de cours", desc: "Téléchargez les supports de cours, études de cas et syllabi mis à disposition par vos enseignants." },
        { title: "Dépôt de devoirs", desc: "Cliquez sur l'activité 'Devoir', vérifiez la date limite, et déposez votre document au format PDF standardisé." },
        { title: "Évaluation", desc: "Complétez obligatoirement l'évaluation de fin de cours pour valider votre parcours." }
      ]
    },
    {
      id: "tuto-teams-visio",
      title: "Rejoindre et participer activement à une classe virtuelle Teams",
      tool: "Microsoft Teams",
      duration: "5 min",
      level: "Débutant",
      category: "Collaboration",
      icon: "fas fa-users-rectangle",
      summary: "Rejoindre une réunion, gérer son micro et sa caméra, partager son écran et participer au chat de cours.",
      steps: [
        { title: "Accès à la réunion", desc: "Ouvrez Teams et cliquez sur le lien de la session depuis le calendrier ou le canal du cours." },
        { title: "Configuration audio/vidéo", desc: "Désactivez votre micro par défaut avant d'entrer pour éviter les bruits parasites." },
        { title: "Interaction", desc: "Utilisez la fonction 'Lever la main' pour demander la parole à l'enseignant et posez vos questions dans le fil de discussion." }
      ]
    },
    {
      id: "tuto-cyber-mdp",
      title: "Créer une Phrase de Passe robuste et sécuriser ses accès",
      tool: "Cybersécurité",
      duration: "5 min",
      level: "Tous niveaux",
      category: "Sécurité",
      icon: "fas fa-shield-alt",
      summary: "La méthode infaillible pour concevoir un mot de passe de plus de 15 caractères mémorisable et inviolable.",
      steps: [
        { title: "Choisir une phrase clé", desc: "Prenez une phrase complète qui a du sens pour vous (ex: 'Le CESAG me propulse vers mon avenir en 2025 !')." },
        { title: "Combiner les caractères", desc: "Mélangez majuscules, minuscules, espaces ou tirets et caractères spéciaux." },
        { title: "Activer le 2FA", desc: "Configurez l'application Microsoft Authenticator sur votre smartphone pour protéger votre compte institutionnel." }
      ]
    },
    {
      id: "tuto-ia-ethique",
      title: "Guide de l'usage académique et éthique de l'IA au CESAG",
      tool: "Intelligence Artificielle",
      duration: "7 min",
      level: "Intermédiaire",
      category: "Innovation",
      icon: "fas fa-robot",
      summary: "Comment exploiter ChatGPT, Claude, Gemini et Perplexity pour enrichir votre apprentissage sans enfreindre la charte académique.",
      steps: [
        { title: "Règle d'or", desc: "L'IA est un tuteur et un facilitateur méthodologique, JAMAIS un rédacteur à votre place." },
        { title: "Usages recommandés", desc: "Clarification de notions complexes, structuration de plans, reformulation de vos propres écrits et recherche d'idées." },
        { title: "Transparence & Citations", desc: "Citez toujours les outils utilisés et vérifiez rigoureusement les sources mentionnées." }
      ]
    }
  ],

  emailTemplates: {
    email6: {
      id: "email6",
      title: "Demande de Réinitialisation Mot de Passe Office 365",
      badge: "Support Informatique",
      icon: "fas fa-key",
      description: "À envoyer au support informatique en cas de compte bloqué.",
      recipient: "oscarkakpo@cesag.edu.sn",
      subject: "Demande de réinitialisation de mot de passe Office 365 - [Prénom NOM]",
      body: `Objet : Demande de réinitialisation de mot de passe Office 365 - [Prénom NOM]

Cher Support Technique CESAG,

Je vous écris pour solliciter la réinitialisation de mon mot de passe Office 365.
Je n'ai plus accès à mon compte institutionnel et la procédure de réinitialisation automatique n'a pas abouti.

Voici mes informations pour vérification :
- Nom et Prénoms : [VOTRE NOM ET PRÉNOMS COMPLETS]
- Email CESAG (bloqué) : [votre.email@cesag.edu.sn]
- Formation / Promotion : [Ex: Master 1 Finance / Licence 3 Gestion]
- Numéro de Téléphone : [+221 XX XXX XX XX]
- Email personnel de secours : [votre.email.personnel@exemple.com]

Je vous remercie par avance pour votre diligence.

Cordialement,

[Prénom NOM]
Étudiant(e) au CESAG`
    },
    email7: {
      id: "email7",
      title: "Demande de Prolongation de Délai (Deadline)",
      badge: "Pédagogie / Professeurs",
      icon: "fas fa-clock",
      description: "Demande formelle et respectueuse de report de date de rendu.",
      recipient: "[email.du.professeur@cesag.edu.sn]",
      subject: "Demande de prolongation - [Nom du Devoir/Projet] - [Matière] - Prénom NOM",
      body: `Objet : Demande de prolongation - [Nom du Devoir/Projet] - [Matière] - Prénom NOM

Cher(e) Professeur [Nom],

Je vous contacte concernant la soumission du [Nom du Devoir/Projet] dans le cadre du cours de [Intitulé de la Matière], initialement prévue pour le [Date initiale].

Je rencontre actuellement [expliquer brièvement la raison valable : difficulté imprévue, charge exceptionnelle, souci de santé].

Afin de vous soumettre un travail rigoureux et de grande qualité, conforme aux exigences du CESAG, je sollicite respectueusement une prolongation de [Nombre] jours, reportant la remise au [Date souhaitée].

Je vous remercie chaleureusement pour votre compréhension et reste à votre entière disposition.

Bien cordialement,

[Prénom NOM]
[Formation / Master X] - CESAG
[prenom.nom@cesag.edu.sn]`
    },
    email8: {
      id: "email8",
      title: "Follow-up / Remerciement après Contact Professionnel",
      badge: "Réseau Professionnel",
      icon: "fas fa-comment-dots",
      description: "Consolider un contact réseau après une conférence ou un échange.",
      recipient: "[contact.professionnel@entreprise.com]",
      subject: "Suite à notre échange du [Date] - Prénom NOM - CESAG",
      body: `Objet : Suite à notre échange du [Date] - Prénom NOM - CESAG

Bonjour [Monsieur / Madame / Titre Nom],

Je tenais à vous remercier sincèrement pour le temps que vous m'avez accordé lors de [notre échange / votre intervention au CESAG / notre appel].

Notre discussion sur [sujet abordé] a été particulièrement éclairante pour mon projet académique et professionnel. J'ai notamment retenu votre recommandation concernant [point spécifique].

Je continue de suivre avec grand intérêt les actualités de [Entreprise / Organisation] et reste à votre disposition.

En vous souhaitant une excellente continuation.

Bien cordialement,

[Prénom NOM]
Étudiant(e) en [Formation] au CESAG
[prenom.nom@cesag.edu.sn] | [+221 XX XXX XX XX]`
    },
    email1: {
      id: "email1",
      title: "Demander un Rendez-vous Académique ou Pro",
      badge: "Orientation & Encadrement",
      icon: "fas fa-handshake",
      description: "Solliciter un entretien avec un enseignant, un tuteur ou un professionnel.",
      recipient: "[destinataire@cesag.edu.sn]",
      subject: "Demande d'entretien - [Sujet / Mémoire / Orientation] - Prénom NOM",
      body: `Objet : Demande d'entretien - [Sujet / Mémoire / Orientation] - Prénom NOM

Bonjour [Titre / Prénom Nom],

Étudiant(e) en [Formation] au CESAG, je porte un grand intérêt aux thématiques de [domaine / spécialité].

Votre parcours et vos travaux en [domaine précis] retiennent toute mon attention, et j'aimerais vivement solliciter vos conseils concernant [mon projet de mémoire / mon orientation professionnelle / un point de cours].

Seriez-vous disponible pour un court échange de 15 à 20 minutes (en présentiel sur le campus ou en visioconférence Teams) selon vos disponibilités ?

Je vous remercie par avance pour votre attention et votre bienveillance.

Cordialement,

[Prénom NOM]
[Formation / Classe] - CESAG
[prenom.nom@cesag.edu.sn] | [+221 XX XXX XX XX]`
    },
    email2: {
      id: "email2",
      title: "Demander une Lettre de Recommandation",
      badge: "Candidatures & Bourses",
      icon: "fas fa-certificate",
      description: "Demander l'appui formel d'un professeur pour un stage ou une admission.",
      recipient: "[professeur@cesag.edu.sn]",
      subject: "Demande de lettre de recommandation - [Candidature Stage/Master] - Prénom NOM",
      body: `Objet : Demande de lettre de recommandation - [Candidature Stage/Master] - Prénom NOM

Bonjour Professeur [Nom],

J'espère que vous vous portez bien.

Je prépare actuellement ma candidature pour [un stage / un programme de Master / une bourse d'excellence] auprès de [Nom de l'Institution / Entreprise], une opportunité déterminante pour mon parcours en [Domaine].

Ayant particulièrement apprécié votre enseignement en [Intitulé du Cours] lors du semestre [Semestre/Année] (note obtenue : [Note]), je sollicite votre appui à travers une lettre de recommandation témoignant de mon engagement et de mes compétences.

La date limite de soumission est fixée au [Date limite]. Je me tiens à votre entière disposition pour vous transmettre mon CV actualisé ainsi que le descriptif détaillé de l'offre.

Je vous remercie infiniment pour votre temps et votre précieux soutien.

Respectueusement,

[Prénom NOM]
[Formation] - CESAG
[prenom.nom@cesag.edu.sn]`
    },
    email3: {
      id: "email3",
      title: "Candidature Spontanée pour un Stage",
      badge: "Insertion Professionnelle",
      icon: "fas fa-briefcase",
      description: "Postuler auprès d'une entreprise ou organisation partenaire.",
      recipient: "[recrutement@entreprise.com]",
      subject: "Candidature Spontanée - Stage [Domaine/Poste] - Prénom NOM (CESAG)",
      body: `Objet : Candidature Spontanée - Stage [Domaine/Poste] - Prénom NOM (CESAG)

Madame, Monsieur,

Actuellement étudiant(e) en [Master / Licence] à l'Institut [Département] du CESAG (Centre Africain d'Études Supérieures en Gestion) à Dakar, je suis avec une grande attention l'évolution et les projets de [Nom de l'Entreprise].

Au cours de mon cursus d'excellence en [Domaine : Finance, Audit, Marketing, Management], j'ai acquis de solides compétences en [Compétence 1, Compétence 2, Compétence 3]. Désireux(se) de mettre ma rigueur et ma proactivité au service de vos équipes, je vous soumets ma candidature pour un stage de [Durée : ex. 3 à 6 mois] à compter de [Date de début].

Vous trouverez ci-joint mon Curriculum Vitae détaillant mon parcours. Je serais ravi(e) de convenir d'un entretien pour vous exposer plus amplement mes motivations.

En vous remerciant de l'attention portée à ma candidature, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Prénom NOM]
Étudiant(e) au CESAG
[prenom.nom@cesag.edu.sn] | [+221 XX XXX XX XX] | [Lien Profil LinkedIn]`
    },
    email4: {
      id: "email4",
      title: "Relancer poliment un Email sans réponse",
      badge: "Communication Professionnelle",
      icon: "fas fa-redo",
      description: "Faire un rappel professionnel après 5 à 7 jours ouvrés.",
      recipient: "[destinataire@exemple.com]",
      subject: "RE: [Objet de l'email initial] - Relance courtoise",
      body: `Objet : RE: [Objet de l'email initial] - Relance courtoise

Bonjour [Monsieur / Madame / Titre Nom],

Je me permets de revenir vers vous concernant mon précédent message du [Date du 1er email] au sujet de [Objet résumé : ma candidature / ma demande de rendez-vous].

Conscient(e) de vos multiples sollicitations et de votre emploi du temps chargé, je tenais simplement à m'assurer de la bonne réception de mes éléments et reste à votre disposition si des précisions supplémentaires sont nécessaires.

Je vous remercie par avance pour votre retour et vous souhaite une excellente semaine.

Bien cordialement,

[Prénom NOM]
[Formation] - CESAG
[prenom.nom@cesag.edu.sn]`
    },
    email5: {
      id: "email5",
      title: "Remercier après un Entretien de Stage ou d'Embauche",
      badge: "Recrutement & Carrière",
      icon: "fas fa-heart",
      description: "À envoyer dans les 24h suivant un entretien d'embauche.",
      recipient: "[recruteur@entreprise.com]",
      subject: "Remerciements suite à notre entretien du [Date] - Poste [Intitulé] - Prénom NOM",
      body: `Objet : Remerciements suite à notre entretien du [Date] - Poste [Intitulé] - Prénom NOM

Bonjour [Madame / Monsieur / Titre Nom],

Je tiens à vous remercier vivement pour l'entretien que vous m'avez accordé [hier / ce matin] concernant l'opportunité de stage/poste en tant que [Intitulé du Poste].

Notre échange a pleinement confirmé mon enthousiasme à rejoindre [Nom de l'Entreprise], et j'ai particulièrement apprécié nos discussions autour de [citer un projet ou un défi évoqué lors de l'entretien].

Je reste à votre entière disposition pour tout renseignement complémentaire et réitère ma forte motivation à apporter mon dynamisme et les compétences acquises au CESAG à votre équipe.

Bien cordialement,

[Prénom NOM]
[Formation] - CESAG
[prenom.nom@cesag.edu.sn] | [+221 XX XXX XX XX]`
    }
  },

  cyberRules: [
    { id: 1, text: "J'utilise un mot de passe unique et robuste pour chaque service (au moins 12 à 16 caractères)." },
    { id: 2, text: "J'ai activé la double authentification (2FA / Microsoft Authenticator) sur mes comptes institutionnels." },
    { id: 3, text: "Je ne communique JAMAIS mon mot de passe par email, message ou formulaire non officiel." },
    { id: 4, text: "Je ne réalise pas d'opérations sensibles ou confidentielles sur un réseau Wi-Fi public sans protection." },
    { id: 5, text: "Je vérifie attentivement l'adresse de l'expéditeur et les liens avant d'ouvrir une pièce jointe (anti-phishing)." },
    { id: 6, text: "Je sauvegarde régulièrement mes documents académiques importants sur mon espace OneDrive CESAG (1 To)." },
    { id: 7, text: "Je verrouille ma session dès que je quitte mon ordinateur et je maintiens mes applications à jour." }
  ],

  aiGuidelines: {
    motto: "L'IA est un TUTEUR, pas un substitut à votre réflexion.",
    principles: [
      {
        type: "allowed",
        title: "Usages Autorisés & Encouragés",
        icon: "fas fa-check-circle",
        items: [
          "Clarification et vulgarisation de concepts théoriques complexes.",
          "Brainstorming et aide à la structuration d'un plan de mémoire ou d'exposé.",
          "Correction orthographique, stylistique et amélioration de la clarté de vos propres rédactions.",
          "Génération de requêtes bibliographiques et recherche de pistes méthodologiques."
        ]
      },
      {
        type: "forbidden",
        title: "Usages Interdits & Sanctionnés",
        icon: "fas fa-times-circle",
        items: [
          "Soumission d'un devoir, examen ou mémoire généré intégralement par IA sans travail personnel.",
          "Copier-coller aveugle de données non vérifiées pouvant contenir des hallucinations.",
          "Non-citation des outils d'IA utilisés lors de la production d'un livrable académique.",
          "Partage de données institutionnelles confidentielles sur des modèles publics non sécurisés."
        ]
      }
    ]
  },

  quizQuestions: [
    {
      id: 1,
      question: "Quelle est la règle d'or pour l'utilisation de l'IA (ChatGPT, Claude, Gemini) au CESAG ?",
      options: [
        "L'IA peut rédiger intégralement mes devoirs sans mention de source.",
        "L'IA est un tuteur et un facilitateur, jamais un substitut à ma réflexion personnelle.",
        "L'usage de l'intelligence artificielle est formellement banni de tous les cours.",
        "On peut copier du contenu IA en changeant simplement deux ou trois mots."
      ],
      answer: "L'IA est un tuteur et un facilitateur, jamais un substitut à ma réflexion personnelle.",
      explanation: "Le CESAG encourage l'adoption responsable de l'IA pour apprendre et approfondir, tout en interdisant le plagiat et la délégation totale de vos travaux."
    },
    {
      id: 2,
      question: "Quelle action est OBLIGATOIRE sur Moodle et conditionne votre accès aux examens de semestre ?",
      options: [
        "L'évaluation anonyme des enseignements en fin de module.",
        "L'installation d'un fond d'écran CESAG.",
        "L'envoi hebdomadaire d'un email au support informatique.",
        "Le téléchargement de tous les cours au format ZIP."
      ],
      answer: "L'évaluation anonyme des enseignements en fin de module.",
      explanation: "L'évaluation pédagogique permet d'améliorer continuellement la qualité des enseignements. Elle est strictement anonyme et obligatoire pour débloquer les examens."
    },
    {
      id: 3,
      question: "Combien d'appareils pouvez-vous activer avec votre licence étudiante Microsoft 365 offerte par le CESAG ?",
      options: [
        "1 seul appareil",
        "Jusqu'à 5 appareils (PC, Mac, tablettes, smartphones)",
        "2 appareils maximum",
        "Aucun, la licence n'est utilisable qu'en salle informatique"
      ],
      answer: "Jusqu'à 5 appareils (PC, Mac, tablettes, smartphones)",
      explanation: "Votre compte institutionnel @cesag.edu.sn vous permet d'installer les applications Microsoft 365 complètes sur 5 ordinateurs/appareils personnels."
    },
    {
      id: 4,
      question: "Comment réinitialiser en toute autonomie et instantanément son mot de passe Moodle FOAD ?",
      options: [
        "En attendant la rentrée suivante.",
        "Via le lien 'Mot de passe perdu ?' sur formations.cesagonline.com avec son email CESAG.",
        "En téléphonant obligatoirement à la direction générale.",
        "En créant un nouveau compte avec une adresse Gmail personnelle."
      ],
      answer: "Via le lien 'Mot de passe perdu ?' sur formations.cesagonline.com avec son email CESAG.",
      explanation: "Moodle dispose d'un système de réinitialisation automatique immédiat qui vous envoie un lien sécurisé sur votre messagerie Outlook CESAG."
    },
    {
      id: 5,
      question: "Quelle méthode est la plus sûre pour concevoir un mot de passe robuste et facile à retenir ?",
      options: [
        "Utiliser sa date de naissance précédée de son prénom.",
        "Utiliser le même mot de passe court sur tous les sites web.",
        "Créer une 'Phrase de Passe' longue (15+ caractères) combinant mots, chiffres et symboles.",
        "Écrire son mot de passe sur un post-it collé sur son écran."
      ],
      answer: "Créer une 'Phrase de Passe' longue (15+ caractères) combinant mots, chiffres et symboles.",
      explanation: "La longueur est le facteur numéro 1 de sécurité. Une phrase de passe est à la fois ultra-résistante aux attaques par force brute et facile à mémoriser."
    },
    {
      id: 6,
      question: "Quelle plateforme internationale propose des certifications de MOOCs obligatoires dans certains modules du CESAG ?",
      options: [
        "TikTok",
        "FutureLearn",
        "Wikipedia",
        "Netflix"
      ],
      answer: "FutureLearn",
      explanation: "Le CESAG intègre des parcours certifiants FutureLearn pour enrichir votre cursus de certifications internationales reconnues."
    }
  ],

  faq: [
    {
      category: "Comptes & Accès",
      question: "J'ai oublié mon mot de passe Office 365 (Email / Teams), comment faire ?",
      answer: "Si vous avez configuré la double authentification, vous pouvez le réinitialiser en toute autonomie sur la page de connexion Microsoft. Sinon, utilisez notre modèle d'email pré-rempli dans la section 'Dépannage' et adressez votre demande au support (oscarkakpo@cesag.edu.sn). Un mot de passe temporaire vous sera envoyé sous 24 à 48h ouvrées."
    },
    {
      category: "Comptes & Accès",
      question: "Comment réinitialiser mon mot de passe Moodle ?",
      answer: "La procédure est 100% instantanée : rendez-vous sur formations.cesagonline.com, cliquez sur 'Mot de passe perdu ?', renseignez votre adresse email institutionnelle CESAG, puis cliquez sur le lien reçu dans votre boîte Outlook."
    },
    {
      category: "Pédagogie & Cours",
      question: "Pourquoi l'évaluation des enseignements sur Moodle est-elle obligatoire ?",
      answer: "C'est une condition sine qua non pour valider votre semestre académique. Sans évaluation, l'accès aux examens est suspendu. Cette procédure est totalement anonyme et permet au CESAG de garantir une qualité d'enseignement du plus haut standard."
    },
    {
      category: "Bureautique & Logiciels",
      question: "Comment installer la suite Microsoft 365 complète sur mon ordinateur ?",
      answer: "Connectez-vous sur www.office.com avec votre adresse @cesag.edu.sn. Cliquez sur le bouton 'Installer les applications' en haut à droite, téléchargez le package et suivez l'assistant. Vous pouvez l'installer sur 5 appareils simultanément."
    },
    {
      category: "Pédagogie & IA",
      question: "Quelle est la politique officielle du CESAG concernant l'Intelligence Artificielle ?",
      answer: "Le CESAG autorise et encourage l'usage de l'IA (ChatGPT, Gemini, Claude, Perplexity) comme outil d'assistance, d'approfondissement méthodologique et de clarification de concepts. Il est strictement interdit de soumettre des travaux générés sans apport intellectuel personnel. Toute source doit être rigoureusement citée."
    },
    {
      category: "Support & Contact",
      question: "Qui contacter et quelles sont les heures d'ouverture de l'assistance numérique ?",
      answer: "Le support informatique est joignable à oscarkakpo@cesag.edu.sn. Les permanences ont lieu du Lundi au Vendredi de 11h00 à 12h00 et de 16h30 à 18h00. Pensez à toujours préciser votre Nom, Prénom et Promotion pour un traitement rapide."
    }
  ]
};

// Export global pour utilisation dans les scripts
if (typeof window !== 'undefined') {
  window.CESAG_DATA = CESAG_DATA;
}
