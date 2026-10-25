"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { z } from "zod";
import { ResumeUploader } from "@/components/admin/ResumeUploader";
import { ADMIN_SECTIONS } from "@/lib/admin-navigation";

const CountResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(z.json()),
});
type CountResult = { count?: number; failed?: boolean };

/** Reads current repository content so a pending or failed deploy cannot stale the inventory. */
export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, CountResult>>({});
  const [reading, setReading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function readInventory() {
      const results = await Promise.all(
        ADMIN_SECTIONS.filter((section) => section.collection).map(
          async (section) => {
            try {
              const response = await fetch("/api/admin/data/" + section.id, {
                cache: "no-store",
                signal: controller.signal,
              });
              const result = CountResponseSchema.safeParse(
                await response.json(),
              );
              if (!response.ok || !result.success)
                return [section.id, { failed: true }] as const;
              return [section.id, { count: result.data.data.length }] as const;
            } catch {
              return [section.id, { failed: true }] as const;
            }
          },
        ),
      );
      if (controller.signal.aborted) return;
      setCounts(Object.fromEntries(results));
      setReading(false);
    }
    void readInventory();
    return () => controller.abort();
  }, [revision]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-page-copy">
            A place for the work behind your portfolio.
          </p>
        </div>
        <Link
          href="/admin/projects/draft"
          className="admin-button admin-button--primary"
        >
          Draft from GitHub
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </header>
      <div className="admin-overview-grid">
        <section
          className="admin-inventory"
          aria-labelledby="admin-content-heading"
        >
          <div className="admin-panel-header">
            <div>
              <h2 id="admin-content-heading">Your content</h2>
              <p className="admin-muted">
                Edit a section, then save it to GitHub.
              </p>
            </div>
            <button
              className="admin-button admin-button--quiet"
              type="button"
              disabled={reading}
              onClick={() => {
                setReading(true);
                setRevision((value) => value + 1);
              }}
            >
              <RefreshCw size={15} aria-hidden="true" />
              {reading ? "Reading…" : "Refresh"}
            </button>
          </div>
          <div className="admin-content-list">
            {ADMIN_SECTIONS.map((section) => (
              <Link
                className="admin-content-row"
                data-admin-section={section.id}
                href={"/admin/" + section.id}
                key={section.id}
              >
                <div>
                  <h3>{section.label}</h3>
                  <p>{section.description}</p>
                </div>
                <span className="admin-content-count">
                  {section.collection
                    ? counts[section.id]?.count !== undefined
                      ? counts[section.id].count +
                        (counts[section.id].count === 1 ? " entry" : " entries")
                      : counts[section.id]?.failed
                        ? "Count unavailable"
                        : "Loading…"
                    : "Settings"}
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <p className="admin-inventory-note" role="status">
            {reading
              ? "Reading current content…"
              : Object.values(counts).some((item) => item.failed)
                ? "Some counts couldn’t be read. Open the section or refresh to try again."
                : "Counts reflect the current content source."}
          </p>
        </section>
        <div className="admin-overview-side">
          <section className="admin-publishing-note">
            <h2>From edit to live.</h2>
            <p>
              Saving commits your changes to GitHub. Vercel rebuilds the
              portfolio after the commit.
            </p>
            <p>
              If a save conflicts with another edit, keep your changes and
              reload the latest version before saving again.
            </p>
            <div className="admin-actions">
              <Link className="admin-button" href="/admin/projects">
                Edit projects
              </Link>
              <Link className="admin-text-link" href="#resume">
                Upload résumé
              </Link>
            </div>
          </section>
          <section
            className="admin-panel"
            id="resume"
            aria-labelledby="admin-resume-heading"
          >
            <div className="admin-panel-header">
              <div>
                <h2 id="admin-resume-heading">Résumé</h2>
                <p className="admin-muted">
                  Replace the PDF visitors can download.
                </p>
              </div>
            </div>
            <ResumeUploader currentResumeUrl="/resume.pdf" />
          </section>
        </div>
      </div>
    </div>
  );
}
