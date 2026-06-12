import { NextResponse } from "next/server";
import {
  feedbackCategoryLabel,
  validateFeedbackPayload,
  type FeedbackPayload,
} from "@/lib/feedback";
import { feedbackEmail, siteUrl } from "@/lib/site";

async function sendDiscordWebhook(
  webhookUrl: string,
  payload: FeedbackPayload,
): Promise<void> {
  const fields = [
    { name: "Type", value: feedbackCategoryLabel(payload.category) },
    { name: "Message", value: payload.message.slice(0, 1024) },
  ];

  if (payload.page) {
    fields.push({ name: "Page", value: payload.page });
  }
  if (payload.email) {
    fields.push({ name: "Reply email", value: payload.email });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Albion Silver Feedback",
      embeds: [
        {
          title: "New site feedback",
          color: 0xc9a227,
          fields,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed (${response.status})`);
  }
}

function resolveFormSubmitOrigin(page?: string): { referer: string; origin: string } {
  // FormSubmit activation is tied to the canonical site URL (www).
  const canonicalOrigin = siteUrl;

  if (page?.trim()) {
    try {
      const url = new URL(page.trim());
      const canonicalPage = new URL(
        `${url.pathname}${url.search}${url.hash}`,
        canonicalOrigin,
      );
      return { referer: canonicalPage.href, origin: canonicalOrigin };
    } catch {
      // fall through
    }
  }

  return { referer: canonicalOrigin, origin: canonicalOrigin };
}

async function sendFormSubmitEmail(
  inboxEmail: string,
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { referer, origin } = resolveFormSubmitOrigin(payload.page);

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(inboxEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: referer,
        Origin: origin,
      },
      body: JSON.stringify({
        _subject: `[Albion Silver] ${feedbackCategoryLabel(payload.category)}`,
        category: feedbackCategoryLabel(payload.category),
        message: payload.message,
        page: payload.page ?? referer,
        email: payload.email ?? "Not provided",
        _template: "table",
        _captcha: "false",
      }),
    },
  );

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
      error: `Check ${feedbackEmail} for a FormSubmit activation email and click the link once.`,
    };
  }

  return {
    ok: false,
    error: message || `Could not send feedback. Email ${feedbackEmail} directly instead.`,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateFeedbackPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL?.trim();
  const inboxEmail = process.env.FEEDBACK_EMAIL?.trim() || feedbackEmail;

  if (!webhookUrl && !inboxEmail) {
    return NextResponse.json(
      {
        error:
          "Feedback is not configured yet. Set FEEDBACK_WEBHOOK_URL or FEEDBACK_EMAIL on the server.",
      },
      { status: 503 },
    );
  }

  if (webhookUrl) {
    try {
      await sendDiscordWebhook(webhookUrl, parsed.data);
    } catch (error) {
      console.error("Feedback delivery failed:", error);
      return NextResponse.json(
        { error: "Could not send feedback. Please try again later." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  const emailResult = await sendFormSubmitEmail(inboxEmail, parsed.data);
  if (!emailResult.ok) {
    return NextResponse.json({ error: emailResult.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
