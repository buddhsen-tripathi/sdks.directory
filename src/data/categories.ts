import type { CategoryMeta } from "../types/catalog";

export const categories: CategoryMeta[] = [
  {
    id: "ai",
    name: "AI & ML",
    description: "Models, agents, embeddings, and inference APIs",
  },
  {
    id: "auth",
    name: "Auth & Identity",
    description: "Authentication, SSO, and user management",
  },
  {
    id: "payments",
    name: "Payments",
    description: "Billing, checkout, and financial APIs",
  },
  {
    id: "cloud",
    name: "Cloud Platforms",
    description: "Hyperscaler and edge compute platforms",
  },
  {
    id: "database",
    name: "Databases",
    description: "SQL, NoSQL, vector, and serverless data",
  },
  {
    id: "comms",
    name: "Communications",
    description: "SMS, voice, chat, and realtime messaging",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Product analytics, events, and measurement",
  },
  {
    id: "storage",
    name: "Storage",
    description: "Object storage, files, and CDNs",
  },
  {
    id: "devtools",
    name: "Developer Tools",
    description: "CI, testing, feature flags, and tooling",
  },
  {
    id: "observability",
    name: "Observability",
    description: "Logs, traces, errors, and monitoring",
  },
  {
    id: "security",
    name: "Security",
    description: "Secrets, WAF, bot protection, and scanning",
  },
  {
    id: "media",
    name: "Media",
    description: "Images, video, and streaming pipelines",
  },
  {
    id: "maps",
    name: "Maps & Location",
    description: "Geocoding, maps, and places APIs",
  },
  {
    id: "email",
    name: "Email",
    description: "Transactional and marketing email APIs",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "DNS, networking, and platform primitives",
  },
];

export function getCategory(id: string): CategoryMeta | undefined {
  return categories.find((category) => category.id === id);
}
