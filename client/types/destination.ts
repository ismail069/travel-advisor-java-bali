export type Locale = "id" | "en";

export type QuickFact = {
  label: string;
  value: string;
};

export type ScoreItem = {
  label: string;
  score: 1 | 2 | 3 | 4 | 5;
  explanation?: string;
};

export type TicketEntry = {
  label: string;
  price: string;
  note?: string;
};

export type OpeningHoursEntry = {
  dayLabel: string;
  hours: string;
  note?: string;
};

export type FacilityItem = {
  label: string;
  available: boolean;
  note?: string;
};

export type AccessibilityItem = {
  label: string;
  status: "available" | "partial" | "unavailable" | "unknown";
  note?: string;
};

export type NearbyDestination = {
  name: string;
  href: string;
  distance?: string;
  travelTime?: string;
  relation?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type SourceItem = {
  title: string;
  url: string;
  organization?: string;
  accessedAt?: string;
};

export type HeroProps = {
  eyebrow?: string;
  title: string;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type EditorialNoticeVariant = "info" | "warning" | "success";
