"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { feedbackCategories } from "@/lib/feedback";
import type { FeedbackCategory } from "@/lib/feedback";
import {
  feedbackEmail,
  feedbackMailtoUrl,
  submitFeedback,
} from "@/lib/feedback-client";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FeedbackContextValue {
  openFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}

function FeedbackForm({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const formId = useId();
  const messageId = `${formId}-message`;
  const emailId = `${formId}-email`;
  const categoryId = `${formId}-category`;

  const [category, setCategory] = useState<FeedbackCategory>("guide");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const page =
        typeof window !== "undefined"
          ? `${window.location.origin}${pathname}`
          : pathname;

      const result = await submitFeedback({
        category,
        message,
        email: email.trim() || undefined,
        page,
      });

      if (!result.ok) {
        setStatus("error");
        setErrorMessage(
          result.error ??
            `Something went wrong. Email ${feedbackEmail} directly instead.`,
        );
        return;
      }

      setStatus("success");
      setMessage("");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4 py-2 text-center">
        <p className="font-display text-lg font-semibold text-gold">
          Thanks for the feedback
        </p>
        <p className="text-sm leading-relaxed text-parchment/70">
          Your message was sent. Corrections and suggestions help keep these
          guides accurate.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary px-5 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor={categoryId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-parchment/50"
        >
          Feedback type
        </label>
        <select
          id={categoryId}
          name="category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as FeedbackCategory)
          }
          className="ui-control ui-select w-full"
          disabled={status === "submitting"}
        >
          {feedbackCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={messageId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-parchment/50"
        >
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe what should change, what broke, or what you'd like to see..."
          className="ui-control w-full resize-y px-3 py-2.5 text-sm leading-relaxed"
          disabled={status === "submitting"}
        />
        <p className="mt-1 text-right text-xs text-parchment/40">
          {message.length}/2000
        </p>
      </div>

      <div>
        <label
          htmlFor={emailId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-parchment/50"
        >
          Email <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="ui-control w-full px-3 py-2.5 text-sm"
          disabled={status === "submitting"}
        />
      </div>

      {errorMessage ? (
        <div className="space-y-2">
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </p>
          <p className="text-xs text-parchment/50">
            Or email{" "}
            <a
              href={feedbackMailtoUrl}
              className="text-gold underline underline-offset-2 hover:text-gold/80"
            >
              {feedbackEmail}
            </a>{" "}
            directly.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary px-4 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          disabled={status === "submitting"}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-5 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Send feedback"}
        </button>
      </div>
    </form>
  );
}

function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="feedback-dialog fixed inset-0 z-[100] m-auto w-[min(100%-2rem,32rem)] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-gold/20 bg-obsidian-light p-0 text-parchment shadow-2xl backdrop:bg-[var(--overlay)] open:flex open:flex-col"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="border-b border-gold/10 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="font-display text-lg font-semibold text-gold"
            >
              Send feedback
            </h2>
            <p className="mt-1 text-sm text-parchment/60">
              Spot an error in a guide, broken calculator, or have an idea?
              Let us know.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/20 text-parchment/70 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        {open ? <FeedbackForm onClose={onClose} /> : null}
      </div>
    </dialog>
  );
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openFeedback = useCallback(() => setOpen(true), []);
  const closeFeedback = useCallback(() => setOpen(false), []);

  return (
    <FeedbackContext.Provider value={{ openFeedback }}>
      {children}
      <FeedbackDialog open={open} onClose={closeFeedback} />
    </FeedbackContext.Provider>
  );
}

interface FeedbackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function FeedbackButton({
  className = "btn-secondary inline-flex px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
  children = "Feedback",
}: FeedbackButtonProps) {
  const { openFeedback } = useFeedback();

  return (
    <button type="button" onClick={openFeedback} className={className}>
      {children}
    </button>
  );
}
