
import "./globals.css";

import Providers from "./providers";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingTour } from "@/components/onboarding-tour";
import { ServiceWorkerRegister } from "@/components/service-worker";

export const metadata = {
  title: "EFCE UI",
  description: "Enterprise Failure Causality Engine UI",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0b0b0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ServiceWorkerRegister />
          <CommandPalette />
          <OnboardingTour />
          {children}
        </Providers>
      </body>
    </html>
  );
}
