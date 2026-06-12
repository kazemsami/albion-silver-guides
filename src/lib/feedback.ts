export const feedbackCategories = [
  { id: "guide", label: "Guide correction" },
  { id: "bug", label: "Bug or broken feature" },
  { id: "suggestion", label: "Suggestion" },
  { id: "other", label: "Other" },
] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number]["id"];

export interface FeedbackPayload {
  category: FeedbackCategory;
  message: string;
  email?: string;
  page?: string;
  /** Honeypot, must stay empty. */
  website?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFeedbackPayload(
  body: unknown,
): { ok: true; data: FeedbackPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;

  if (typeof record.website === "string" && record.website.trim()) {
    return { ok: false, error: "Invalid submission." };
  }

  const category = record.category;
  if (
    typeof category !== "string" ||
    !feedbackCategories.some((item) => item.id === category)
  ) {
    return { ok: false, error: "Please choose a feedback type." };
  }

  const message =
    typeof record.message === "string" ? record.message.trim() : "";
  if (message.length < 10) {
    return { ok: false, error: "Message must be at least 10 characters." };
  }
  if (message.length > 2000) {
    return { ok: false, error: "Message must be 2000 characters or less." };
  }

  let email: string | undefined;
  if (record.email != null && record.email !== "") {
    if (typeof record.email !== "string" || !EMAIL_PATTERN.test(record.email.trim())) {
      return { ok: false, error: "Please enter a valid email or leave it blank." };
    }
    email = record.email.trim();
  }

  let page: string | undefined;
  if (typeof record.page === "string" && record.page.trim()) {
    page = record.page.trim().slice(0, 500);
  }

  return {
    ok: true,
    data: {
      category: category as FeedbackCategory,
      message,
      email,
      page,
    },
  };
}

export function feedbackCategoryLabel(category: FeedbackCategory): string {
  return (
    feedbackCategories.find((item) => item.id === category)?.label ?? category
  );
}
