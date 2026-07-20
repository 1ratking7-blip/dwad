export type Locale = 'ru' | 'en' | 'vi';

export interface GameEntry {
  title: string;
  desc: string;
  rtp: string;
  tag: string;
}

export interface StepEntry {
  title: string;
  desc: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    orgDescription: string;
  };
  header: {
    logoAria: string;
    navBonuses: string;
    navGames: string;
    navHowItWorks: string;
    navFaq: string;
    provablyFair: string;
    ctaPlayNow: string;
    menuOpen: string;
    menuClose: string;
    mobileCta: string;
  };
  hero: {
    badge: string;
    h1Line1: string;
    h1Line2: string;
    subtitle: string;
    ctaButton: string;
    noKyc: string;
    instantPayouts: string;
    ageGate: string;
    statDailyLabel: string;
    statDailyValue: string;
    statDailySub: string;
    statCryptoLabel: string;
    statCryptoValue: string;
    statCryptoSub: string;
    statRakebackLabel: string;
    statRakebackValue: string;
    statRakebackSub: string;
  };
  socialProof: {
    exampleWinLabel: string;
    won: string;
    multiplierLabel: string;
  };
  luckyWheel: {
    badge: string;
    h2Line1: string;
    h2Line2: string;
    description: string;
    feature1: string;
    feature2: string;
    feature3: string;
    spinButton: string;
    spinning: string;
    prizeLabel: string;
    claimButton: string;
    segments: string[];
  };
  games: {
    h2Line1: string;
    h2Line2: string;
    description: string;
    viewAll: string;
    playButton: string;
    list: GameEntry[];
  };
  howItWorks: {
    heading: string;
    subtitle: string;
    steps: StepEntry[];
    ctaButton: string;
  };
  bonusSection: {
    h2Line1: string;
    h2Line2: string;
    description: string;
    ctaLabel: string;
    remainingLabel: string;
    disclaimer: string;
  };
  faq: {
    heading: string;
    subtitle: string;
    items: FaqEntry[];
  };
  footer: {
    description: string;
    platformHeading: string;
    gamesOriginals: string;
    slots: string;
    sportsbook: string;
    esports: string;
    supportHeading: string;
    blog: string;
    faq: string;
    howToStart: string;
    vipClub: string;
    contacts: string;
    bonusesHeading: string;
    welcome360: string;
    dailyLuckySpin: string;
    weeklyCashback: string;
    rakeback20: string;
    copyright: string;
    privacyPolicy: string;
    termsOfUse: string;
    responsibleGambling: string;
    socialTwitterSoon: string;
    socialTelegramSoon: string;
    socialGithubSoon: string;
    soonTitle: string;
  };
  errorBoundary: {
    title: string;
    message: string;
    cta: string;
  };
  languageSwitcher: {
    label: string;
  };
  skipToContent: string;
  opensInNewWindow: string;
}
