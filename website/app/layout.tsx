import type { Metadata } from "next";
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
  keywords: ["javascript", "typescript", "runtime", "bun", "node", "package manager", "bundler"],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    operatingSystem: "Linux, macOS, Windows",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: site.description,
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F4F8F6] dark:bg-[#071A16] text-zinc-900 dark:text-[#F0F6FC] antialiased selection:bg-[#2FA866] selection:text-white font-sans transition-colors duration-200">
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
