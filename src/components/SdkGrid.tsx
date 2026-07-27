import { motion, useReducedMotion } from "motion/react";
import type { SdkEntry } from "../types/catalog";
import { SdkCard } from "./SdkCard";

interface SdkGridProps {
  sdks: SdkEntry[];
  emptyMessage?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function SdkGrid({
  sdks,
  emptyMessage = "No SDKs match these filters.",
}: SdkGridProps) {
  const reduce = useReducedMotion();

  if (sdks.length === 0) {
    return (
      <p className="rounded-sm bg-surface-card px-6 py-12 text-center text-body ring-1 ring-hairline">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sdks.map((sdk, index) =>
        reduce ? (
          <SdkCard key={sdk.id} sdk={sdk} />
        ) : (
          <motion.div
            key={sdk.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              ease,
              delay: Math.min(index, 8) * 0.04,
            }}
          >
            <SdkCard sdk={sdk} />
          </motion.div>
        ),
      )}
    </div>
  );
}
