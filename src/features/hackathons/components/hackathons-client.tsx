"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookmarkCheck, Plus } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "./hackathon-card";
import { HackathonSearch } from "./hackathon-search";
import { HackathonFilters } from "./hackathon-filters";
import { hackathons } from "@/data/hackathons";
import { defaultHackathonFilters, type HackathonFilters } from "../types";
import { matchesHackathonFilters } from "../utils";
import { addHackathon, removeHackathon } from "../storage";
import { useEnrolledHackathons } from "../hooks";

type HackathonsClientProps = {
  enrolledPage?: boolean;
};

function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <Card className="border-border/70 bg-surface px-6 py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
          <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] border border-border bg-background text-foreground">
            <BookmarkCheck className="size-8" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            No Hackathons Enrolled Yet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start tracking hackathons from the Hackathons page and they&apos;ll appear here.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white">
              <Link href="/hackathons">
                <Plus className="size-4" />
                Explore Hackathons
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

export function HackathonsClient({ enrolledPage = false }: HackathonsClientProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<HackathonFilters>(defaultHackathonFilters);
  const { trackedIds, trackedHackathons } = useEnrolledHackathons(hackathons);

  const source = enrolledPage ? trackedHackathons : hackathons;
  const filteredHackathons = useMemo(
    () => source.filter((hackathon) => matchesHackathonFilters(hackathon, filters, query)),
    [source, filters, query]
  );

  const handleTrack = (hackathonId: string) => {
    const result = addHackathon(hackathonId);
    if (result.status === "duplicate") {
      toast("Already Tracking");
      return;
    }

    toast.success("Added to Enrolled");
  };

  const handleRemove = (hackathonId: string) => {
    removeHackathon(hackathonId);
    toast.success("Tracking Removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {enrolledPage ? (
              <PageHeader
                eyebrow="Enrolled"
                title="My Enrolled Hackathons"
                subtitle="Track all your registered and followed hackathons in one place."
              />
            ) : (
              <PageHeader
                eyebrow="Hackathons"
                title="Discover Hackathons"
                subtitle="Find the best hackathons, innovation challenges and coding competitions from around the world."
              />
            )}

            {!enrolledPage ? (
              <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(240px,3fr)]">
                <HackathonSearch value={query} onChange={setQuery} />
                <HackathonFilters filters={filters} onChange={setFilters} />
              </div>
            ) : null}

            {filteredHackathons.length > 0 ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredHackathons.map((hackathon, index) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    index={index}
                    tracked={trackedIds.includes(hackathon.id)}
                    enrolledMode={enrolledPage}
                    showNotifications={enrolledPage}
                    onTrack={(item) => handleTrack(item.id)}
                    onRemove={(item) => handleRemove(item.id)}
                  />
                ))}
              </div>
            ) : enrolledPage ? (
              <EmptyState />
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-border bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
                No hackathons match your current search and filters.
              </div>
            )}

            {!enrolledPage ? (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="py-20 sm:py-24"
              >
                <div className="mx-auto max-w-3xl">
                  <Card className="border-border/70 bg-surface px-6 py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      More ahead
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      🚀 More Hackathons Coming Soon
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                      We&apos;re constantly adding new hackathons. Keep exploring with HackRadar. Stay
                      tuned for exciting opportunities!
                    </p>
                  </Card>
                </div>
              </motion.section>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
