import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DesignWorks | Creative Design Solutions That Captivate",
  description: "Transform your brand with professional design subscription service. Unlimited requests, fast turnaround, dedicated team.",
  keywords: "design agency, graphic design subscription, brand identity, web design",
  authors: [{ name: "DesignWorks" }],
  creator: "DesignWorks",
  publisher: "DesignWorks",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://designworks.com",
    title: "DesignWorks | Creative Design Solutions That Captivate",
    description: "Transform your brand with professional design subscription service. Unlimited requests, fast turnaround, dedicated team.",
    siteName: "DesignWorks",
  },
  twitter: {
    card: "summary_large_image",
    title: "DesignWorks | Creative Design Solutions That Captivate",
    description: "Transform your brand with professional design subscription service. Unlimited requests, fast turnaround, dedicated team.",
    creator: "@designworks",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}