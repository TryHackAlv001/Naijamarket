'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [role, setRole] = useState<"buyer" | "vendor">("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await signUp(email, password, name, phone, role, {
        shopName,
        shopDescription,
        location,
      });
      router.push("/main");
    } catch (err: any) {
      setError(err.message ?? "Unable to register.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Create a new OrderIt account to start selling or shopping worldwide.</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className={`rounded-2xl px-5 py-2 text-sm font-semibold ${role === "buyer" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
            onClick={() => setRole("buyer")}
          >
            Buyer
          </button>
          <button
            type="button"
            className={`rounded-2xl px-5 py-2 text-sm font-semibold ${role === "vendor" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
            onClick={() => setRole("vendor")}
          >
            Vendor
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          <Input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            required
          />
          <Input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            required
          />
          {role === "vendor" ? (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Vendor details</p>
              <Input
                type="text"
                value={shopName}
                onChange={(event) => setShopName(event.target.value)}
                placeholder="Shop name"
                required
              />
              <Input
                type="text"
                value={shopDescription}
                onChange={(event) => setShopDescription(event.target.value)}
                placeholder="Shop description"
              />
              <Input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
              />
            </div>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Create account"}
          </Button>
        </form>
      </section>
    </main>
  );
}
