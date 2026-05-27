import type { AudienceVariant } from "../types";

export const audienceVariants: Record<string, AudienceVariant> = {
  infra: {
    id: "infra",
    projectOrder: ["optim", "mbse", "hospital", "vv", "ruga", "news"],
  },
  tpm: {
    id: "tpm",
    projectOrder: ["optim", "ruga", "news", "mbse", "hospital", "vv"],
  },
  ai: {
    id: "ai",
    projectOrder: ["vv", "hospital", "news", "optim", "mbse", "ruga"],
  },
  se: {
    id: "se",
    projectOrder: ["ruga", "vv", "mbse", "optim", "hospital", "news"],
  },
};

export function getAudienceVariant(value: string | null): AudienceVariant {
  if (!value) return { id: "default" };
  return audienceVariants[value] ?? { id: "default" };
}
