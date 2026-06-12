import {
  feedbackCategoryLabel,
  validateFeedbackPayload,
  type FeedbackCategory,
} from "@/lib/feedback";
import { feedbackEmail } from "@/lib/site";

export interface FeedbackSubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitFeedback(input: {
  category: FeedbackCategory;
  message: string;
  email?: string;
  page: string;
}): Promise<FeedbackSubmitResult> {
  const parsed = validateFeedbackPayload({
    category: input.category,
    message: input.message,
    email: input.email,
    page: input.page,
  });

  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const payload = parsed.data;

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(feedbackEmail)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[Albion Silver] ${feedbackCategoryLabel(payload.category)}`,
          category: feedbackCategoryLabel(payload.category),
          message: payload.message,
          page: payload.page,
          email: payload.email ?? "Not provided",
          _template: "table",
          _captcha: "false",
        }),
      },
    );

    if (response.status === 403) {
      return {
        ok: false,
        error: `Email service blocked the request. Email ${feedbackEmail} directly instead.`,
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: `Email service error (${response.status}). Try again or email ${feedbackEmail}.`,
      };
    }

    const result = (await response.json()) as {
      success?: string | boolean;
      message?: string;
    };

    const succeeded =
      result.success === true ||
      result.success === "true" ||
      String(result.success).toLowerCase() === "true";

    if (succeeded) {
      return { ok: true };
    }

    const message = result.message ?? "";
    if (/activation/i.test(message)) {
      return {
        ok: false,
        error: `Check ${feedbackEmail} for a FormSubmit activation email and click Activate Form once.`,
      };
    }

    return {
      ok: false,
      error:
        message ||
        `Could not send feedback. Email ${feedbackEmail} directly instead.`,
    };
  } catch {
    return {
      ok: false,
      error: `Network error. Email ${feedbackEmail} directly instead.`,
    };
  }
}

export const feedbackMailtoUrl = `mailto:${feedbackEmail}?subject=${encodeURIComponent("Albion Silver feedback")}`;

export { feedbackEmail };
