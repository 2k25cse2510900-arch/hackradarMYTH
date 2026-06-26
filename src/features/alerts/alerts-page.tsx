"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hackradar-alert-preferences";

type AlertPreferences = {
  whatsapp: boolean;
  telegram: boolean;
  aiCalls: boolean;
  browser: boolean;
  email: boolean;
  reminderTiming: "24" | "12" | "1";
};

const defaultPreferences: AlertPreferences = {
  whatsapp: false,
  telegram: false,
  aiCalls: false,
  browser: false,
  email: false,
  reminderTiming: "24",
};

function loadPreferences() {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(raw) } as AlertPreferences;
  } catch {
    return defaultPreferences;
  }
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-surface shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

function RadioItem({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: AlertPreferences["reminderTiming"];
  current: AlertPreferences["reminderTiming"];
  onSelect: (value: AlertPreferences["reminderTiming"]) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
        active
          ? "border-primary bg-primary text-background"
          : "border-border bg-background text-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}

export function AlertsPage() {
  const [preferences, setPreferences] = useState<AlertPreferences>(() => loadPreferences());

  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    toast.success("Preferences Saved Successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Alerts
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Notification Settings
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Manage how HackRadar keeps you updated about your enrolled hackathons.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mx-auto mt-10 max-w-3xl"
            >
              <Card className="border-border/70 bg-surface p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
                <div className="space-y-6">
                  <div className="grid gap-3">
                    <ToggleRow
                      title="WhatsApp Alerts"
                      description="Receive important hackathon reminders on WhatsApp."
                      checked={preferences.whatsapp}
                      onChange={(value) => setPreferences((current) => ({ ...current, whatsapp: value }))}
                    />
                    <ToggleRow
                      title="Telegram Alerts"
                      description="Receive instant Telegram notifications."
                      checked={preferences.telegram}
                      onChange={(value) => setPreferences((current) => ({ ...current, telegram: value }))}
                    />
                    <ToggleRow
                      title="AI Call Alerts"
                      description="Receive an AI-powered reminder call before important deadlines and events."
                      checked={preferences.aiCalls}
                      onChange={(value) => setPreferences((current) => ({ ...current, aiCalls: value }))}
                    />
                    <ToggleRow
                      title="Browser Notifications"
                      description="Receive notifications directly in your browser."
                      checked={preferences.browser}
                      onChange={(value) => setPreferences((current) => ({ ...current, browser: value }))}
                    />
                    <ToggleRow
                      title="Email Notifications"
                      description="Receive updates by email."
                      checked={preferences.email}
                      onChange={(value) => setPreferences((current) => ({ ...current, email: value }))}
                    />
                  </div>

                  <div className="rounded-[1.75rem] border border-border bg-background p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                      Reminder Timing
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <RadioItem
                        label="24 Hours Before"
                        value="24"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                      <RadioItem
                        label="12 Hours Before"
                        value="12"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                      <RadioItem
                        label="1 Hour Before"
                        value="1"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={savePreferences}
                    className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </motion.div>

            <div className="mx-auto mt-6 max-w-3xl">
              <div className="rounded-[1.75rem] border border-border bg-muted/40 px-5 py-4 text-sm leading-6 text-muted-foreground">
                These settings are currently stored locally. Cloud synchronization and personalized
                notifications will be available in a future update.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
