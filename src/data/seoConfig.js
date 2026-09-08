import { propertyData } from './propertyData.js';

export const seoConfig = {
  title: "AURELIA | Contemporary Luxury Villa Residence",
  description: "Experience AURELIA, a bespoke contemporary luxury villa residence. Featuring horizontal travertine architecture, floor-to-ceiling glass, 5 bedroom suites, and a heated infinity pool.",
  canonicalUrl: "https://aurelia-residence.pages.dev/",
  ogImage: "https://aurelia-residence.pages.dev/static/luxury-villa-exterior.jpg",
  siteName: "AURELIA Luxury Residence",
  locale: "en_US",
  twitterHandle: "@aurelia_estate",

  getJsonLd() {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://aurelia-residence.pages.dev/#website",
          "url": "https://aurelia-residence.pages.dev/",
          "name": propertyData.identity.name,
          "description": propertyData.identity.positioning,
          "publisher": {
            "@id": "https://aurelia-residence.pages.dev/#organization"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://aurelia-residence.pages.dev/#organization",
          "name": propertyData.identity.name,
          "url": "https://aurelia-residence.pages.dev/",
          "logo": "https://aurelia-residence.pages.dev/favicon.svg",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Concierge & Private Enquiries",
            "email": propertyData.identity.contactEmail,
            "telephone": `+${propertyData.identity.whatsappNumber}`
          }
        },
        {
          "@type": "SingleFamilyResidence",
          "@id": "https://aurelia-residence.pages.dev/#residence",
          "name": propertyData.identity.title,
          "description": propertyData.identity.positioning,
          "url": "https://aurelia-residence.pages.dev/",
          "image": [
            "https://aurelia-residence.pages.dev/static/luxury-villa-exterior.jpg",
            "https://aurelia-residence.pages.dev/static/luxury-villa-architecture.jpg",
            "https://aurelia-residence.pages.dev/static/luxury-villa-interior.jpg",
            "https://aurelia-residence.pages.dev/static/luxury-villa-pool.jpg"
          ],
          "numberOfBedrooms": 5,
          "numberOfBathroomsTotal": 6,
          "numberOfRooms": 14,
          "floorSize": {
            "@type": "QuantitativeValue",
            "value": 900,
            "unitCode": "MTK",
            "unitText": "square meters"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mediterranean Hillside",
            "addressRegion": "Coastal Region",
            "addressCountry": "IT"
          },
          "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Heated Zero-Edge Infinity Pool", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Sunken Fireplace Lounge", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Floor-to-Ceiling Thermal Glazing", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Bespoke Walk-in Dressing Suite", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Sculptural Marble Kitchen", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Mature Mediterranean Gardens & Olive Grove", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Private Gated Motor Court", "value": true }
          ]
        }
      ]
    };
  }
};
