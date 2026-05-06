interface MessageBubbleProps {
  text: string;
  incoming?: boolean;
}

export function MessageBubble({ text, incoming = false }: MessageBubbleProps) {
  return (
    <div className={`rounded-3xl px-4 py-3 ${incoming ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white"}`}>
      {text}
    </div>
  );
}
