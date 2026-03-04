import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title: defaultTitle = "LASAK EDU – Training Institute in Coimbatore | IT, Mechanical & Civil Courses",
  description: defaultDescription = "LASAK EDU – Leading training institute in Coimbatore offering IT, Mechanical & Civil courses with 100% placement support.",
  keywords: defaultKeywords = "LASAK EDU, lasakedu, lasak edu, LASAK Institute, LasakEdu Coimbatore, IT training Coimbatore, Mechanical training Coimbatore, Civil training Coimbatore",
  image: defaultImage = "/img/lasakedu-logo-v2.png",
  url: defaultUrl = "https://lasakedu.in",
}) => {
  const location = useLocation();
  const [seoData, setSeoData] = useState({
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords,
    image_url: defaultImage,
    url: defaultUrl
  });

  useEffect(() => {
    fetchDynamicSEO();
  }, [location.pathname, defaultTitle, defaultDescription, defaultKeywords, defaultImage, defaultUrl]);

  const fetchDynamicSEO = async () => {
    try {
      const currentPath = location.pathname;
      const q = query(collection(db, 'page_seo'), where('page_path', '==', currentPath), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setSeoData({
          title: data.title || defaultTitle,
          description: data.description || defaultDescription,
          keywords: data.keywords || defaultKeywords,
          image_url: data.image_url || defaultImage,
          url: window.location.href
        });
      } else {
        resetToDefaults();
      }
    } catch (err) {
      console.warn("SEO fetch failed, using defaults", err);
      resetToDefaults();
    }
  };

  const resetToDefaults = () => {
    setSeoData({
      title: defaultTitle,
      description: defaultDescription,
      keywords: defaultKeywords,
      image_url: defaultImage,
      url: defaultUrl
    });
  };

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{seoData.title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      <meta name="robots" content="index, follow" />

      {/* Canonical */}
      <link rel="canonical" href={seoData.url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image_url} />
      <meta property="og:url" content={seoData.url} />
      <meta property="og:site_name" content="LASAK EDU Institute" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image_url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.png" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "LASAK EDU",
          "alternateName": ["LasakEdu", "LASAK Institute", "Lasak Edu Institute"],
          "url": "https://lasakedu.in",
          "logo": "https://lasakedu.in/img/lasakedu-logo-v2.png",
          "image": "https://lasakedu.in/img/lasakedu-logo-v2.png",
          "description": "LASAK EDU is a leading training institute in Coimbatore offering industry-standard IT, Mechanical and Civil courses with placement support.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Coimbatore",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
          },
          "telephone": "+91-7418732525",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7418732525",
            "contactType": "customer support",
            "availableLanguage": ["English", "Tamil"]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
