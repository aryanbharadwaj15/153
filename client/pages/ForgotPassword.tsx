import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email");
    }
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-md rounded-xl border bg-white/70 dark:bg-black/30 p-6 shadow">
        <h1 className="text-2xl font-extrabold">Reset your password</h1>
        <p className="text-muted-foreground">We'll email you a reset link</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
        {sent && <p className="mt-3 text-sm text-emerald-600">Reset link sent. Check your inbox.</p>}
        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </div>
      </div>
    </section>
  );
}
