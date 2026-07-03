"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";

export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${form.name || "the website"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4 border border-white/12 bg-ink/40 p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check size={18} />
        </span>
        <h3 className="font-display text-2xl font-light text-cream">Your email is ready to send.</h3>
        <p className="text-sm leading-relaxed text-cream/65">
          We&apos;ve opened your mail app with the message drafted. If nothing appeared, write to us
          directly at{" "}
          <a href={`mailto:${email}`} className="text-primary underline">
            {email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60">
          Your name
        </label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-white/15 bg-transparent px-4 py-3 text-cream outline-none transition-colors focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60">
          Email
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-white/15 bg-transparent px-4 py-3 text-cream outline-none transition-colors focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60">
          What can we bake for you?
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full resize-none border border-white/15 bg-transparent px-4 py-3 text-cream outline-none transition-colors focus:border-primary"
        />
      </div>
      <button
        type="submit"
        className="bg-primary px-9 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-flax hover:text-cream"
      >
        Send enquiry
      </button>
    </form>
  );
}
