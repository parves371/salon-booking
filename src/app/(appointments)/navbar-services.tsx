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
    <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      {/* Step 1 Link (always accessible) */}
      <span
        style={{
          cursor: "pointer",
          textDecoration: pathname === "/appointment" ? "underline" : "none",
        }}
        onClick={() => handleNavClick("/appointment", 1)}
      >
        Step 1
      </span>

      <span>{">"}</span>

      {/* Step 2 Link (only clickable if step >= 2) */}
      <span
        style={{
          cursor: step >= 2 ? "pointer" : "not-allowed",
          opacity: step >= 2 ? 1 : 0.5,
          textDecoration: pathname === "/professional" ? "underline" : "none",
        }}
        onClick={() => handleNavClick("/professional", 2)}
      >
        Step 2
      </span>

      <span>{">"}</span>

      {/* Step 3 Link (only clickable if step >= 3) */}
      <span
        style={{
          cursor: step >= 3 ? "pointer" : "not-allowed",
          opacity: step >= 3 ? 1 : 0.5,
          textDecoration: pathname === "/time" ? "underline" : "none",
        }}
        onClick={() => handleNavClick("/time", 3)}
      >
        Step 3
      </span>
    </nav>
  );
}
