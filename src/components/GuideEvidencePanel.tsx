"use client";

import { useState } from "react";
import type { GuideReliability } from "@/types/guide";
import { reviewStatusLabels } from "@/types/guide";
import { formatGuideLastUpdated } from "@/lib/guide-display";
import { formatSilverExact } from "@/lib/format";

export function GuideEvidencePanel({
  reliability,
}: {
  reliability: GuideReliability;
}) {
  const [open, setOpen] = useState(false);
  const evidence = reliability.evidence;

  if (
    reliability.status === "needs-review" ||
    !evidence
  ) {
    return null;
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
      >
        {open ? "Hide" : "View"} verification evidence ({reviewStatusLabels[reliability.status]})
      </button>
      {open && (
        <dl className="mt-3 grid gap-2 rounded-lg border border-gold/15 bg-obsidian/40 p-4 text-sm sm:grid-cols-2">
          {evidence.runs != null && (
            <>
              <dt className="text-parchment/45">Runs logged</dt>
              <dd className="text-parchment/80">{evidence.runs}</dd>
            </>
          )}
          <dt className="text-parchment/45">Date</dt>
          <dd className="text-parchment/80">{evidence.date}</dd>
          {evidence.server && (
            <>
              <dt className="text-parchment/45">Server</dt>
              <dd className="text-parchment/80">{evidence.server}</dd>
            </>
          )}
          {evidence.gear && (
            <>
              <dt className="text-parchment/45">Gear / spec</dt>
              <dd className="text-parchment/80">{evidence.gear}</dd>
            </>
          )}
          {evidence.market && (
            <>
              <dt className="text-parchment/45">Market used</dt>
              <dd className="text-parchment/80">{evidence.market}</dd>
            </>
          )}
          {evidence.rawLootSilver != null && (
            <>
              <dt className="text-parchment/45">Raw loot value</dt>
              <dd className="tabular-nums text-parchment/80">
                {formatSilverExact(evidence.rawLootSilver)}
              </dd>
            </>
          )}
          {evidence.deathsOrKnockdowns != null && (
            <>
              <dt className="text-parchment/45">Deaths / knockdowns</dt>
              <dd className="text-parchment/80">{evidence.deathsOrKnockdowns}</dd>
            </>
          )}
          {evidence.netSilver != null && (
            <>
              <dt className="text-parchment/45">Final net silver</dt>
              <dd className="tabular-nums text-emerald-400/90">
                {formatSilverExact(evidence.netSilver)}
              </dd>
            </>
          )}
          {evidence.notes && (
            <>
              <dt className="col-span-full text-parchment/45">Notes</dt>
              <dd className="col-span-full text-parchment/65">{evidence.notes}</dd>
            </>
          )}
          {evidence.sources && evidence.sources.length > 0 ? (
            <>
              <dt className="text-parchment/45">Sources</dt>
              <dd className="text-parchment/80">
                <ul className="list-inside list-disc space-y-1">
                  {evidence.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : (
            evidence.sourceUrl && (
              <>
                <dt className="text-parchment/45">Source</dt>
                <dd className="text-parchment/80">
                  <a
                    href={evidence.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
                  >
                    {evidence.sourceTitle ?? evidence.sourceUrl}
                  </a>
                </dd>
              </>
            )
          )}
          <dt className="text-parchment/45">Guide last updated</dt>
          <dd className="text-parchment/80">
            {formatGuideLastUpdated(reliability.lastUpdated)}
          </dd>
        </dl>
      )}
    </div>
  );
}
