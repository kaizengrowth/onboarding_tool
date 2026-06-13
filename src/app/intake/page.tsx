import type { Metadata } from "next";
import { ConversationalIntake } from "@/components/intake/ConversationalIntake";

export const metadata: Metadata = {
  title: "Talk to us — The Hall",
  description:
    "Tell us what happened. We'll help you figure out what comes next.",
};

export default function IntakePage() {
  return (
    <main className="min-h-screen px-4 py-12 md:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="text-sm font-medium text-neutral-500 mb-2">The Hall</p>
          <h1 className="text-2xl font-semibold text-neutral-900 leading-snug">
            You don&rsquo;t have to figure this out alone.
          </h1>
          <p className="mt-2 text-neutral-500 text-sm">
            This conversation is confidential — only Hall organizers can see it.
          </p>
        </header>
        <ConversationalIntake />
      </div>
    </main>
  );
}
