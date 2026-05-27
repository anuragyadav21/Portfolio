export type ModalMetric = {
  value: string;
  label: string;
};

export type ModalArtifact = {
  label: string;
  href: string;
  type: "report" | "code" | "demo" | "video" | "slides" | "artifact";
};

export type ModalSection = {
  title: string;
  body?: string[];
  metrics?: ModalMetric[];
  team?: string;
  stack?: string[];
};

export type Project = {
  id: string;
  layer: string;
  title: string;
  summary: string;
  result: string;
  chips: string[];
  featured?: boolean;
  wide?: boolean;
  /** When set, opening this project loads the full interactive case study instead of the modal. */
  embedUrl?: string;
  modal: {
    kicker: string;
    title: string;
    artifacts?: ModalArtifact[];
    sections: ModalSection[];
  };
};

export type StackProblem = {
  title: string;
  description: string;
  projects: string[];
  tools: string[];
  projectId?: string;
};

export type StackLayer = {
  number: string;
  title: string;
  subtitle: string;
  proof: string;
  color: string;
  problems: StackProblem[];
};

export type FieldStory = {
  id: string;
  company: string;
  years: string;
  role: string;
  title: string;
  summary: string;
  tag: string;
  modal: Project["modal"];
};

export type TimelineItem = {
  years: string;
  company: string;
  role: string;
};

export type LifeMoment = {
  title: string;
  caption: string;
  background: string;
  image?: string;
  tall?: boolean;
};

export type StudioPieceLayout = "large" | "wide" | "tall" | "default";

export type StudioPiece = {
  id: string;
  title: string;
  medium: string;
  layout: StudioPieceLayout;
  /** Resized tile image — run npm run life:thumbs after updating originals */
  thumb: string;
  /** Full-size original — opens in a new tab when the tile is clicked */
  full: string;
  placeholderIcon: string;
  placeholderLabel: string;
};

export type AudienceVariant = {
  id: string;
  projectOrder?: string[];
};
