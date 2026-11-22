import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import "@/styles/home.css";
import "@/styles/handbook.css";
import "@/styles/pages.css";
import "@/styles/responsive.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: "RC Runtime · JavaScript and TypeScript", template: "%s · RC Runtime" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Rahul Chaube", url: "https://github.com/Rahulchaube1" }],
  keywords: [
    "RC Runtime",
    "RahulChaube Runtime",
    "JavaScript",
    "TypeScript",
    "RC Web",
    "QuickJS-NG",
    "esbuild",
  ],
  manifest: "/site.webmanifest",
  icons: { icon: [{ url: "/rc-mark-32.png", sizes: "32x32", type: "image/png" }], apple: "/rc-mark-180.png" },
  alternates: { types: { "application/rss+xml": site.feed } },
  openGraph: {
    title: "RC Runtime",
    description: site.description,
    siteName: site.name,
    type: "website",
    images: [
      {
        url: "/rc-social.jpg?art=terminal",
        width: 1200,
        height: 630,
        alt: "RC Runtime running a TypeScript greeting from the terminal",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/rc-social.jpg?art=terminal"] },
};
export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: site.theme.dark },
    { media: "(prefers-color-scheme: light)", color: site.theme.light },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: site.name,
        alternateName: "RahulChaube Runtime",
        softwareVersion: site.version,
        operatingSystem: "Linux, macOS, Windows",
        applicationCategory: "DeveloperApplication",
        description: site.description,
        author: { "@type": "Person", name: "Rahul Chaube", url: "https://github.com/Rahulchaube1" },
        license: site.social.github + "/blob/main/LICENSE.md",
        downloadUrl: site.domain + "/download",
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: site.domain,
        potentialAction: {
          "@type": "SearchAction",
          target: site.domain + "/docs?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch{}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body>
        <a className="skip" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
