import { propertyData } from '../data/propertyData.js';

/**
 * Clean, Professional, Emoji-Free WhatsApp Lead Generator.
 * Formats strictly according to luxury editorial standards.
 */

export function generateWhatsAppUrl(formData = {}) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || propertyData.identity.whatsappNumber;
  const propertyName = propertyData.identity.name;

  const name = (formData.name || "").trim() || "Prospective Client";
  const email = (formData.email || "").trim() || "Not provided";
  const phone = (formData.phone || "").trim() || "Not provided";
  const preferred = (formData.preferred || "WhatsApp").trim();
  const message = (formData.message || "").trim() || "I would like to request additional information and arrange a private presentation.";

  // Strictly NO emojis, NO symbols, clean luxury structure
  const lines = [
    `New Property Enquiry`,
    `Property: ${propertyName} Contemporary Luxury Villa`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Preferred Contact: ${preferred}`,
    ``,
    `Message:`,
    `${message}`
  ];

  const fullText = lines.join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(fullText)}`;
}

export function openWhatsAppEnquiry(formData = {}) {
  const url = generateWhatsAppUrl(formData);
  window.open(url, '_blank', 'noopener,noreferrer');
}
