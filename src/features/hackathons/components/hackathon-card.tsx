"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookmarkMinus,
  CalendarDays,
  CircleDot,
  MapPin,
  Rocket,
  BellRing,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Hackathon } from "../types";

type HackathonCardProps = {
  hackathon: Hackathon;
  index: number;
  tracked?: boolean;
  enrolledMode?: boolean;
  showNotifications?: boolean;
  onRemove?: (hackathon: Hackathon) => void;
  onTrack?: (hackathon: Hackathon) => void;
};

function Badge({ children, tone }: { children: ReactNode; tone?: "default" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tone === "muted"
          ? "border-border bg-background text-muted-foreground"
          : "border-border bg-surface text-foreground"
      )}
    >
      {children}
    </span>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-background px-3 py-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function TrackButton({
  tracked,
  enrolledMode,
  showNotifications,
  onTrack,
  hackathon,
}: {
  tracked?: boolean;
  enrolledMode?: boolean;
  showNotifications?: boolean;
  onTrack?: (hackathon: Hackathon) => void;
  hackathon: Hackathon;
}) {
  if (enrolledMode) {
    return (
      <Button asChild className="bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white shadow-[0_10px_28px_rgba(220,38,38,0.18)] hover:bg-gradient-to-r hover:from-[#dc2626] hover:to-[#ef4444] hover:text-white">
        <Link href="/alerts">
          <BellRing className="size-4" />
          {showNotifications ? "Notifications" : "Tracking ✓"}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => onTrack?.(hackathon)}
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_10px_28px_rgba(37,99,235,0.22)]",
        "transition-all duration-300 hover:scale-[1.02] hover:brightness-105 hover:shadow-[0_14px_34px_rgba(37,99,235,0.28)]",
        "dark:from-[#6d28d9] dark:to-[#2563EB] dark:shadow-[0_10px_28px_rgba(109,40,217,0.20)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        tracked ? "opacity-95" : ""
      )}
      aria-pressed={tracked}
    >
      <motion.span
        animate={tracked ? { opacity: [0.96, 1, 0.96] } : { opacity: [0.98, 1, 0.98] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="inline-flex items-center gap-2"
      >
        <Target className="size-4" />
        {tracked ? "✓ Enrolled" : "Track"}
      </motion.span>
    </Button>
  );
}

export function HackathonCard({
  hackathon,
  index,
  tracked = false,
  enrolledMode = false,
  showNotifications = false,
  onTrack,
  onRemove,
}: HackathonCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group flex h-full flex-col justify-between border-border/70 bg-surface/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm",
          "relative overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out",
          "hover:border-[#4f46e5]/20 hover:shadow-[0_18px_45px_rgba(79,70,229,0.10),0_2px_8px_rgba(59,130,246,0.06)]",
          "dark:hover:border-cyan-400/15 dark:hover:shadow-[0_18px_45px_rgba(34,211,238,0.08),0_2px_8px_rgba(168,85,247,0.06)]"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
            "bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_40%)]",
            "group-hover:opacity-100",
            "dark:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.10),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_40%)]"
          )}
        />
        <div className="relative">
          {enrolledMode ? (
            <button
              type="button"
              onClick={() => onRemove?.(hackathon)}
              aria-label={`Remove ${hackathon.name} from enrolled hackathons`}
              className="absolute right-0 top-0 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BookmarkMinus className="size-4" />
            </button>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold text-foreground">
                {hackathon.logo}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
                  {hackathon.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{hackathon.organizer}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone={hackathon.status === "Live" ? "default" : "muted"}>{hackathon.status}</Badge>
              <Badge tone="muted">{hackathon.mode}</Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{hackathon.domain}</Badge>
            <Badge tone="muted">{hackathon.difficulty}</Badge>
            <Badge tone="muted">{hackathon.registration}</Badge>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">{hackathon.description}</p>

          <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            <MetaRow
              icon={<CalendarDays className="size-4" />}
              label="Registration Deadline"
              value={hackathon.deadline}
            />
            <MetaRow
              icon={<CircleDot className="size-4" />}
              label={
                hackathon.eventDates.includes("–") ||
                hackathon.eventDates.toLowerCase().includes("ongoing") ||
                hackathon.eventDates.toLowerCase().includes("rolling")
                  ? "Event Dates"
                  : "Event Date"
              }
              value={hackathon.eventDates}
            />
            <MetaRow icon={<Rocket className="size-4" />} label="Prize Pool" value={hackathon.prizePool} />
            <MetaRow icon={<MapPin className="size-4" />} label="Location" value={hackathon.location} />
          </div>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
          <Button variant="outline" asChild className="relative overflow-hidden">
            <Link href={hackathon.officialWebsite} target="_blank" rel="noreferrer">
              More Details
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <TrackButton
            tracked={tracked}
            enrolledMode={enrolledMode}
            showNotifications={showNotifications}
            onTrack={onTrack}
            hackathon={hackathon}
          />
        </div>
      </Card>
    </motion.article>
  );
}
