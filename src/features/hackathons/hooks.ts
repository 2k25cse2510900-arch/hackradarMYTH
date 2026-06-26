"use client";

import { useEffect, useState } from "react";

import type { Hackathon } from "@/data/hackathons";
import { getStoredEnrolledHackathonIds, getTrackedHackathons } from "./storage";

export function useEnrolledHackathons(hackathons: Hackathon[]) {
  const [trackedIds, setTrackedIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setTrackedIds(getStoredEnrolledHackathonIds());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("hackradar-enrolled-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("hackradar-enrolled-updated", sync);
    };
  }, []);

  const trackedHackathons = getTrackedHackathons(hackathons);

  return {
    trackedIds,
    trackedHackathons,
  };
}
