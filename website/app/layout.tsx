import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "javascript",
    "typescript",
    "runtime",
    "rahulchaube-cli",
    "node",
    "package manager",
    "bundler",
    "rahulchaube",
    "rahulchaube runtime",
    "developer platform",
    "v8",
    "javascriptcore"
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: site.domain,
    types: {
      "application/rss+xml": `${site.domain}/feed.xml`,
    },
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.domain,
    siteName: site.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: site.name }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/social-card.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${site.domain}/#software`,
        name: site.name,
        operatingSystem: "Linux, macOS, Windows",
        applicationCategory: "DeveloperApplication",
        softwareVersion: "1.0.0",
        downloadUrl: `${site.domain}/download`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: site.description,
      },
      {
        "@type": "WebSite",
        "@id": `${site.domain}/#website`,
        url: site.domain,
        name: site.name,
        description: site.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.domain}/docs?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${site.domain}/#organization`,
        name: site.name,
        url: site.domain,
        logo: `${site.domain}/logo.png`,
      },
      {
        "@type": "Person",
        "@id": `${site.domain}/#person`,
        name: "Rahul Chaube",
        url: "https://github.com/Rahulchaube1",
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="bg-[#F4F8F6] dark:bg-[#071A16] text-zinc-900 dark:text-[#F0F6FC] antialiased selection:bg-[#2FA866] selection:text-white font-sans transition-colors duration-200 overflow-x-hidden w-full min-w-[320px]">
        <Navbar />
        <main className="min-h-[70vh] w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
