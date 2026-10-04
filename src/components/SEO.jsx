import { useEffect } from "react";
import { PRODUCTION_URL } from "../utils/slug";

/**
 * Dynamic SEO Component.
 * Updates document.title, standard meta tags, OpenGraph, Twitter Cards,
 * canonical links, and injects Schema.org JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  canonical,
  image = `${PRODUCTION_URL}/Icon.png`,
  type = "website",
  noindex = false,
  nofollow = false,
  structuredData = null,
}) {
  useEffect(() => {
    // 1. Update Document Title
    const defaultTitle = "Reelify - Discover Movies, TV Series, Ratings & Trailers";
    const fullTitle = title || defaultTitle;
    document.title = fullTitle;

    // Helper to safely query and create/update meta tags
    const updateMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", contentValue);
    };

    // 2. Standard Meta Tags
    const defaultDesc =
      "Discover trending movies, top-rated web series, cast details, ratings, and official trailers on Reelify. Powered by TMDB.";
    const activeDesc = description || defaultDesc;
    updateMetaTag("name", "description", activeDesc);

    // Robots meta tag
    let robotsContent = "index, follow";
    if (noindex && nofollow) {
      robotsContent = "noindex, nofollow";
    } else if (noindex) {
      robotsContent = "noindex, follow";
    }
    updateMetaTag("name", "robots", robotsContent);

    // 3. Open Graph Metadata
    const activeUrl = canonical || PRODUCTION_URL;
    updateMetaTag("property", "og:site_name", "Reelify");
    updateMetaTag("property", "og:type", type);
    updateMetaTag("property", "og:title", fullTitle);
    updateMetaTag("property", "og:description", activeDesc);
    updateMetaTag("property", "og:url", activeUrl);
    updateMetaTag("property", "og:image", image);
    updateMetaTag("property", "og:image:alt", fullTitle);

    // 4. Twitter Card Metadata
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", fullTitle);
    updateMetaTag("name", "twitter:description", activeDesc);
    updateMetaTag("name", "twitter:image", image);
    updateMetaTag("name", "twitter:url", activeUrl);

    // 5. Canonical URL Link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", activeUrl);

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = "reelify-dynamic-jsonld";
    let scriptEl = document.getElementById(SCRIPT_ID);

    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Clean up dynamic JSON-LD on route unmount
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonical, image, type, noindex, nofollow, structuredData]);

  return null;
}
