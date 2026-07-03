"use client";

// ForcePasswordChange — blocking first-login credential rotation.
//
// Tenant provisioning creates the admin user with a GENERATED password and
// `user_metadata.must_change_password = true`. While that flag is set, this
// modal covers the entire admin (no dismiss, no outside-click close) so the
// very first thing an owner does is pick their own password — after which
// the platform-generated one stops working anywhere. Optionally they can
// also move the account to their real email address.
//
// Mounted in app/admin/layout.tsx for every admin page; renders nothing
// when the flag is absent, so it costs one metadata read per mount.

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForcePasswordChange() {
  const supabase = createClient();
  const [required, setRequired] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) return;
      setCurrentEmail(data.user.email ?? "");
      setRequired(Boolean(data.user.user_metadata?.must_change_password));
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!required) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 10) { setError("Use at least 10 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setSaving(true);
    try {
      // Password + flag clear in one call. Email (if changed) goes second —
      // Supabase sends a confirmation link to the new address, so the account
      // keeps working via the old email until the owner confirms.
      const { error: pwErr } = await supabase.auth.updateUser({
        password,
        data: { must_change_password: false },
      });
      if (pwErr) throw pwErr;
      const wantsEmail = newEmail.trim() && newEmail.trim().toLowerCase() !== currentEmail.toLowerCase();
      if (wantsEmail) {
        const { error: emErr } = await supabase.auth.updateUser({ email: newEmail.trim() });
        if (emErr) {
          setEmailNotice(`Password saved, but the email change failed: ${emErr.message}. You can retry from Settings.`);
        } else {
          setEmailNotice("Check your new inbox — the email change applies once you confirm the link.");
        }
      }
      setRequired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the password — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Set your password">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-900">Welcome! Set your own password</h2>
        <p className="mt-1 text-sm text-gray-500">
          You signed in with a temporary password generated for you. Choose your own to secure your
          admin — the temporary one stops working after this.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="fpc-password">New password</label>
            <input
              id="fpc-password" type="password" autoComplete="new-password" required minLength={10}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="fpc-confirm">Confirm password</label>
            <input
              id="fpc-confirm" type="password" autoComplete="new-password" required minLength={10}
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="fpc-email">
              Email <span className="font-normal text-gray-400">(optional — switch to your real address)</span>
            </label>
            <input
              id="fpc-email" type="email" autoComplete="email" placeholder={currentEmail}
              value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {emailNotice && <p className="text-sm text-amber-600">{emailNotice}</p>}
          <button
            type="submit" disabled={saving}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
