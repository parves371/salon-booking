"use client";

import { useWizardStore } from "@/store/wizardStore";
import { usePathname, useRouter } from "next/navigation";

export function NavBarServices() {
  const { step, setStep } = useWizardStore();
  const pathname = usePathname();
  const router = useRouter();

  function handleNavClick(target: string, minStepRequired: number) {
    // If current step < required step, block navigation:
    if (step < minStepRequired) {
      // You could show a toast or alert here if you want
      return;
    }
    router.push(target);
    setStep(minStepRequired);
  }

  return (
    <nav className="flex gap-4 items-center container mx-auto pt-8">
      {/* Step 1 Link (always accessible) */}
      <span
        style={{
          cursor: "pointer",
          color: pathname === "/appointment" ? "black" : "#ACACB4",
        }}
        onClick={() => handleNavClick("/appointment", 1)}
        className="text-2xl font-semiibold hover:text-black"
      >
        Appointment
      </span>

      <span>{">"}</span>

      {/* Step 2 Link (only clickable if step >= 2) */}
      <span
        style={{
          cursor: step >= 2 ? "pointer" : "not-allowed",
          opacity: step >= 2 ? 1 : 0.5,
          color: pathname === "/professional" ? "black" : "#ACACB4",
        }}
        onClick={() => handleNavClick("/professional", 2)}
        className="text-2xl font-semiibold"
      >
        professional
      </span>

      <span>{">"}</span>

      {/* Step 3 Link (only clickable if step >= 3) */}
      <span
        style={{
          cursor: step >= 3 ? "pointer" : "not-allowed",
          opacity: step >= 3 ? 1 : 0.5,
          color: pathname === "/time" ? "black" : "#ACACB4",
        }}
        onClick={() => handleNavClick("/time", 3)}
        className="text-2xl font-semiibold"
      >
        Time
      </span>
    </nav>
  );
}
