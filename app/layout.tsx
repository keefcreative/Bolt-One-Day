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
      <head>
        {/* Brevo Conversations Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.BrevoConversationsSetup = {
                buttonStyle: 'round',
                buttonPosition: 'br',
                chatHeight: 600,
                chatWidth: 400,
                colors: {
                  buttonText: '#FBFBFB',
                  buttonBg: '#FF6B35'
                },
                zIndex: 9999,
                startHidden: false
              };
            `,
          }}
        />
        {/* Brevo Conversations Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, w, c) {
                w.BrevoConversationsID = '${process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_ID || '689cd1ce16d06dcf6c0f5674'}';
                w[c] = w[c] || function() {
                  (w[c].q = w[c].q || []).push(arguments);
                };
                var s = d.createElement('script');
                s.async = true;
                s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
                if (d.head) d.head.appendChild(s);
              })(document, window, 'BrevoConversations');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}