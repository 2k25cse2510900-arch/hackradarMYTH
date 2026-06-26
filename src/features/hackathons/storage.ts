import type { Hackathon } from "@/data/hackathons";

export const ENROLLED_STORAGE_KEY = "hackradar-enrolled";

export function getStoredEnrolledHackathonIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ENROLLED_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function setStoredEnrolledHackathonIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("hackradar-enrolled-updated"));
}

export function addHackathon(hackathonId: string) {
  const ids = getStoredEnrolledHackathonIds();
  if (ids.includes(hackathonId)) {
    return { status: "duplicate" as const, ids };
  }

  const nextIds = [...ids, hackathonId];
  setStoredEnrolledHackathonIds(nextIds);
  return { status: "added" as const, ids: nextIds };
}

export function removeHackathon(hackathonId: string) {
  const ids = getStoredEnrolledHackathonIds();
  const nextIds = ids.filter((id) => id !== hackathonId);
  setStoredEnrolledHackathonIds(nextIds);
  return nextIds;
}

export function isTracked(hackathonId: string) {
  return getStoredEnrolledHackathonIds().includes(hackathonId);
}

export function getTrackedHackathons(hackathons: Hackathon[]) {
  const trackedIds = getStoredEnrolledHackathonIds();
  return hackathons.filter((hackathon) => trackedIds.includes(hackathon.id));
}
