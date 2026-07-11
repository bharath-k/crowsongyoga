// Loads and types the single editable content file (src/content/site.yaml).
// The YAML is inlined at build time via Vite's `?raw` import, so this works
// both in dev and in the bundled production build.
import yaml from 'js-yaml';
import rawSiteYaml from '../content/site.yaml?raw';
import type { DaySession, SaturdayTheme, ScheduleConfig } from './schedule';

export interface NavItem {
  label: string;
  href: string;
}

export interface RateItem {
  name: string;
  price: string;
  note?: string;
  cta_label?: string;
  checkout_url?: string;
}

export interface SiteContent {
  site_name: string;
  tagline: string;
  location_short: string;
  nav: NavItem[];
  hero: {
    heading: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
  };
  practice: {
    heading: string;
    intro: string;
    points: string[];
  };
  schedule: {
    heading: string;
    intro: string;
    days: {
      monday: DaySession;
      tuesday: DaySession;
      wednesday: DaySession;
      thursday: DaySession;
      friday: DaySession;
    };
    friday_alternates: [string, string];
    friday_anchor: { date: string; label: string };
    saturday_note: string;
    saturday_themes: SaturdayTheme[];
    closed_note: string;
    moon_note: string;
    moon_days_link: string;
    moon_rest_days: string[];
  };
  teacher: {
    heading: string;
    name: string;
    title?: string;
    bio: string;
    credentials_heading?: string;
    credentials?: string[];
    highlights?: string[];
    image: string;
    image_alt: string;
  };
  rates: {
    heading: string;
    intro: string;
    items: RateItem[];
    footnote: string;
  };
  consent: {
    heading: string;
    intro: string;
    points: string[];
  };
  payment: {
    heading: string;
    body: string;
    note: string;
  };
  visit: {
    heading: string;
    intro: string;
    address: string;
    directions: string;
    email: string;
    phone: string;
    map_embed: string;
  };
  media: {
    hero_image: string;
    practice_image: string;
    intro_video_heading: string;
    intro_video_caption: string;
    videos: { src: string; poster: string; caption?: string }[];
  };
  footer: {
    tagline: string;
    note: string;
    social?: { label: string; handle: string; url: string }[];
  };
}

export const site = yaml.load(rawSiteYaml) as SiteContent;

// Normalise the schedule section into the shape the banner logic expects.
export const scheduleConfig: ScheduleConfig = {
  days: site.schedule.days,
  fridayAlternates: site.schedule.friday_alternates,
  fridayAnchor: site.schedule.friday_anchor,
  saturdayThemes: site.schedule.saturday_themes,
  moonRestDays: site.schedule.moon_rest_days,
};
