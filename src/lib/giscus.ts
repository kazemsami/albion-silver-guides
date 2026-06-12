/** GitHub repo for Giscus (public discussions). */
export const giscusRepo =
  process.env.NEXT_PUBLIC_GISCUS_REPO?.trim() || "kazemsami/albion-silver";

/** Discussion category name in the repo (create in GitHub Discussions). */
export const giscusCategory =
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY?.trim() || "Guide comments";

/** From https://giscus.app after installing the app on the repo. */
export const giscusRepoId =
  process.env.NEXT_PUBLIC_GISCUS_REPO_ID?.trim() ?? "";

export const giscusCategoryId =
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID?.trim() ?? "";

export function isGiscusConfigured(): boolean {
  return giscusRepoId.length > 0 && giscusCategoryId.length > 0;
}
