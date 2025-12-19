"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function EnhancedSEO({
  title,
  description,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  keywords = [],
  noIndex = false,
}: EnhancedSEOProps) {
  const pathname = usePathname();
  const [canonicalUrl, setCanonicalUrl] = useState("");
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mr5school.com";
  const siteName = "MR5 School";
  const defaultImage = `${siteUrl}/images/mr5-logo.png`;
  const defaultDescription = "Advanced online learning platform with AI-powered avatars, interactive courses, and personalized education. Learn programming, data science, web development, and more with expert instructors.";
  
  const pageTitle = title ? `${title} | ${siteName}` : `${siteName} - Learn with AI`;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url ? `${siteUrl}${url}` : `${siteUrl}${pathname}`;
  
  useEffect(() => {
    setCanonicalUrl(window.location.origin + pathname);
  }, [pathname]);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords.length > 0 ? keywords.join(", ") : "online learning, AI education, programming courses, web development, data science"} />
      <meta name="author" content={author || siteName} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#786eff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />
      <meta property="twitter:site" content="@mr5school" />
      <meta property="twitter:creator" content="@mr5school" />
      
      {/* Dublin Core */}
      <meta name="DC.title" content={pageTitle} />
      <meta name="DC.description" content={pageDescription} />
      <meta name="DC.creator" content={siteName} />
      <meta name="DC.language" content="en" />
      <meta name="DC.publisher" content={siteName} />
      
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteName,
            "url": siteUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
  );
}