/**
 * Open Field — site configuration.
 */

export const site = {
  brand: "ChlZhYa",
  brandSub: "open field",
  pillars: {
    workbench: true,
    journey: true,
    archive: true,
  },
} as const;

export type NavItem = {
  label: string;
  code: string;
  href: string;
  tagline: string;
};

export const nav: NavItem[] = [
  {
    label: "Workbench",
    code: "WB",
    href: "/workbench",
    tagline: "Learning streams in AI & backend engineering.",
  },
  {
    label: "Journey",
    code: "JN",
    href: "/journey",
    tagline: "Trips and the photos I brought back.",
  },
  {
    label: "Archive",
    code: "AR",
    href: "/archive",
    tagline: "Long-form notes from local markdown.",
  },
];
