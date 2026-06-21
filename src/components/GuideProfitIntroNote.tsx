interface GuideProfitIntroNoteProps {
  text: string;
}

export function GuideProfitIntroNote({ text }: GuideProfitIntroNoteProps) {
  return (
    <p className="wiki-note mt-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-parchment/70">
      {text}
    </p>
  );
}
