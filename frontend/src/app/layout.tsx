import "@/css/satoshi.css";
import "@/css/style.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Ann Rakshak - Intelligent Pesticide Control System",
    default: "Ann Rakshak - Intelligent Pesticide Control System",
  },
  description:
    "Ann Rakshak - AI-powered pesticide control system that reduces pesticide usage by 40% while protecting crops. An innovative hackathon project by Ann Rakshak Team.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#10b981" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
