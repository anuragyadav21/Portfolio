/** Single source of truth for portfolio identity & contact links. */
export const profile = {
  name: "Anurag Yadav",
  /** Hero + footer — single line */
  degreeLine: "Cornell M.Eng. Systems Engineering · INCOSE ASEP · 8 yrs EPC delivery",
  location: "Ithaca, NY",
  locationNote: "Currently based in the United States and interested in infrastructure systems, digital engineering, and intelligent physical systems roles.",
  phone: "(607) 262-3840",
  phoneHref: "tel:+16072623840",
  email: "yadavanurag560@gmail.com",
  emailSchool: "ay468@cornell.edu",
  linkedIn: {
    label: "linkedin.com/in/anurag-systems",
    href: "https://www.linkedin.com/in/anurag-systems",
  },
  github: {
    label: "github.com/anuragyadav21",
    href: "https://github.com/anuragyadav21",
  },
  resume: {
    label: "Anurag_Yadav_Resume.pdf",
    href: "/assets/resume/Anurag_Yadav_Resume.pdf",
  },
} as const;

export type ProfileContactLink = {
  type: string;
  label: string;
  href?: string;
  external?: boolean;
};

export const profileContactLinks: ProfileContactLink[] = [
  { type: "Email", label: profile.email, href: `mailto:${profile.email}` },
  { type: "School", label: profile.emailSchool, href: `mailto:${profile.emailSchool}` },
  { type: "Phone", label: profile.phone, href: profile.phoneHref },
  { type: "Location", label: profile.location },
  {
    type: "LinkedIn",
    label: profile.linkedIn.label,
    href: profile.linkedIn.href,
    external: true,
  },
  {
    type: "GitHub",
    label: profile.github.label,
    href: profile.github.href,
    external: true,
  },
  {
    type: "Resume",
    label: profile.resume.label,
    href: profile.resume.href,
    external: true,
  },
];
