"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import {
  giscusCategory,
  giscusCategoryId,
  giscusRepo,
  giscusRepoId,
  isGiscusConfigured,
} from "@/lib/giscus";
import { isTheme, type Theme } from "@/lib/theme";

function useSiteTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;

    const readTheme = () => {
      const value = root.getAttribute("data-theme");
      setTheme(isTheme(value) ? value : "dark");
    };

    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return theme;
}

interface GuideCommentsProps {
  slug: string;
}

/** Stable Giscus lookup key; must match the GitHub discussion title. */
function giscusDiscussionTerm(slug: string): string {
  return `guides/${slug}`;
}

export function GuideComments({ slug }: GuideCommentsProps) {
  const siteTheme = useSiteTheme();
  const giscusTheme = siteTheme === "dark" ? "transparent_dark" : "light";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isGiscusConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return (
        <section
          className="mt-16 border-t border-gold/10 pt-10"
          aria-labelledby="guide-comments-heading"
        >
          <h2
            id="guide-comments-heading"
            className="font-display text-xl font-semibold text-parchment"
          >
            Comments
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-parchment/50">
            Giscus is not configured yet. Enable GitHub Discussions on the
            repo, install the app at{" "}
            <a
              href="https://giscus.app"
              className="text-gold underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              giscus.app
            </a>
            , then set{" "}
            <code className="text-parchment/70">NEXT_PUBLIC_GISCUS_REPO_ID</code>{" "}
            and{" "}
            <code className="text-parchment/70">
              NEXT_PUBLIC_GISCUS_CATEGORY_ID
            </code>{" "}
            in <code className="text-parchment/70">.env.local</code>.
          </p>
        </section>
      );
    }

    return null;
  }

  return (
    <section
      className="mt-16 border-t border-gold/10 pt-10"
      aria-labelledby="guide-comments-heading"
    >
      <h2
        id="guide-comments-heading"
        className="font-display text-xl font-semibold text-parchment"
      >
        Comments
      </h2>
      <p className="mt-2 text-sm text-parchment/50">
        Questions, corrections, and tips for this guide. Sign in with GitHub to
        post.
      </p>
      <div className="giscus-wrap mt-6 min-h-[120px]">
        {mounted ? (
          <Giscus
            key={slug}
            repo={giscusRepo as `${string}/${string}`}
            repoId={giscusRepoId}
            category={giscusCategory}
            categoryId={giscusCategoryId}
            mapping="specific"
            term={giscusDiscussionTerm(slug)}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={giscusTheme}
            lang="en"
            loading="eager"
          />
        ) : null}
      </div>
    </section>
  );
}
