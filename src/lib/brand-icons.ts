import type { ComponentType, SVGProps } from "react";
import type { IconType } from "react-icons";
import {
  SiAirtable,
  SiAlgolia,
  SiAuth0,
  SiClickhouse,
  SiClerk,
  SiCloudflare,
  SiCloudinary,
  SiConvex,
  SiDatadog,
  SiDiscord,
  SiDocker,
  SiElevenlabs,
  SiExpo,
  SiFirebase,
  SiGithub,
  SiGitlab,
  SiGooglecloud,
  SiGrafana,
  SiHuggingface,
  SiKubernetes,
  SiLangchain,
  SiLinear,
  SiMapbox,
  SiMeilisearch,
  SiMongodb,
  SiNeon,
  SiNetlify,
  SiPlanetscale,
  SiPosthog,
  SiPostman,
  SiPrisma,
  SiPulumi,
  SiRedis,
  SiResend,
  SiSentry,
  SiShopify,
  SiStripe,
  SiSupabase,
  SiTerraform,
  SiUpstash,
  SiVercel,
  SiZapier,
} from "react-icons/si";
import Anthropic from "@lobehub/icons/es/Anthropic";
import Aws from "@lobehub/icons/es/Aws";
import Azure from "@lobehub/icons/es/Azure";
import Cloudflare from "@lobehub/icons/es/Cloudflare";
import CrewAI from "@lobehub/icons/es/CrewAI";
import Github from "@lobehub/icons/es/Github";
import Google from "@lobehub/icons/es/Google";
import GoogleCloud from "@lobehub/icons/es/GoogleCloud";
import HuggingFace from "@lobehub/icons/es/HuggingFace";
import LangChain from "@lobehub/icons/es/LangChain";
import LlamaIndex from "@lobehub/icons/es/LlamaIndex";
import Notion from "@lobehub/icons/es/Notion";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Vercel from "@lobehub/icons/es/Vercel";
import type { SdkEntry } from "@/types/catalog";
import { categoryIcons } from "@/lib/icons";

type SvgIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

export type LobeIcon = SvgIcon & {
  Color?: SvgIcon;
};

const lobeBySlug: Record<string, LobeIcon> = {
  anthropic: Anthropic as LobeIcon,
  openai: OpenAI as LobeIcon,
  "openai-agents": OpenAI as LobeIcon,
  aws: Aws as LobeIcon,
  azure: Azure as LobeIcon,
  cloudflare: Cloudflare as LobeIcon,
  "google-cloud": GoogleCloud as LobeIcon,
  "google-genai": Google as LobeIcon,
  "google-maps": Google as LobeIcon,
  vercel: Vercel as LobeIcon,
  "ai-sdk": Vercel as LobeIcon,
  github: Github as LobeIcon,
  huggingface: HuggingFace as LobeIcon,
  "huggingface-skills": HuggingFace as LobeIcon,
  langchain: LangChain as LobeIcon,
  llamaindex: LlamaIndex as LobeIcon,
  crewai: CrewAI as LobeIcon,
  notion: Notion as LobeIcon,
  "agent-sdk-dev": Anthropic as LobeIcon,
  "mcp-server-dev": Anthropic as LobeIcon,
  "frontend-design": Anthropic as LobeIcon,
  "code-review": Anthropic as LobeIcon,
  "feature-dev": Anthropic as LobeIcon,
  "skill-creator": Anthropic as LobeIcon,
};

/** Brands without a Lobe icon, via Simple Icons when available. */
const simpleBySlug: Record<string, IconType> = {
  stripe: SiStripe,
  "stripe-terminal": SiStripe,
  auth0: SiAuth0,
  firebase: SiFirebase,
  supabase: SiSupabase,
  sentry: SiSentry,
  datadog: SiDatadog,
  clerk: SiClerk,
  resend: SiResend,
  posthog: SiPosthog,
  planetscale: SiPlanetscale,
  neon: SiNeon,
  prisma: SiPrisma,
  mongodb: SiMongodb,
  redis: SiRedis,
  algolia: SiAlgolia,
  mapbox: SiMapbox,
  cloudinary: SiCloudinary,
  github: SiGithub,
  gitlab: SiGitlab,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  terraform: SiTerraform,
  pulumi: SiPulumi,
  langchain: SiLangchain,
  huggingface: SiHuggingface,
  shopify: SiShopify,
  discord: SiDiscord,
  linear: SiLinear,
  airtable: SiAirtable,
  meilisearch: SiMeilisearch,
  upstash: SiUpstash,
  vercel: SiVercel,
  cloudflare: SiCloudflare,
  "google-cloud": SiGooglecloud,
  context7: SiUpstash,
  convex: SiConvex,
  expo: SiExpo,
  elevenlabs: SiElevenlabs,
  clickhouse: SiClickhouse,
  grafana: SiGrafana,
  netlify: SiNetlify,
  zapier: SiZapier,
  postman: SiPostman,
};

export function resolveSdkBrandIcon(sdk: SdkEntry) {
  const lobe = lobeBySlug[sdk.slug];
  if (lobe) {
    return { kind: "lobe" as const, Lobe: lobe };
  }

  const simple = simpleBySlug[sdk.slug];
  if (simple) {
    return { kind: "simple" as const, Simple: simple };
  }

  return {
    kind: "category" as const,
    Category: categoryIcons[sdk.categories[0]],
  };
}
