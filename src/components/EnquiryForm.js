import { openWhatsAppEnquiry } from './WhatsAppIntegration.js';

/**
 * Luxury Lead Conversion & Enquiry Form Controller.
 * Handles strict validation, inline feedback, and dual submission actions.
 */

export function initEnquiryForm() {
  const form = document.querySelector('#presentation-form');
  const nameInput = document.querySelector('#enquiry-name');
  const emailInput = document.querySelector('#enquiry-email');
  const phoneInput = document.querySelector('#enquiry-phone');
  const methodSelect = document.querySelector('#enquiry-method');
  const messageInput = document.querySelector('#enquiry-message');
  const whatsappBtn = document.querySelector('#btn-enquire-whatsapp');
  const successAlert = document.querySelector('.form-success-alert');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 7 && /^\d+$/.test(cleaned);
  }

  function setError(input, errorMsg) {
    const errorEl = input?.parentElement?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
    input?.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    const errorEl = input?.parentElement?.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
    input?.removeAttribute('aria-invalid');
  }

  function validateAll() {
    let isValid = true;

    // Name
    const name = nameInput?.value.trim() || '';
    if (name.length < 2) {
      setError(nameInput, 'Please provide your full name.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email
    const email = emailInput?.value.trim() || '';
    if (!validateEmail(email)) {
      setError(emailInput, 'Please provide a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Phone
    const phone = phoneInput?.value.trim() || '';
    if (!validatePhone(phone)) {
      setError(phoneInput, 'Please provide a valid contact telephone number.');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    return isValid;
  }

  // Clear errors on input
  [nameInput, emailInput, phoneInput].forEach(input => {
    input?.addEventListener('input', () => clearError(input));
  });

  // Handle standard form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    // Simulate lead capture
    const leadData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      preferred: methodSelect?.value || 'Email',
      message: messageInput?.value.trim() || '',
      timestamp: new Date().toISOString()
    };

    console.log('Confidential Enquiry Submitted:', leadData);

    if (successAlert) {
      successAlert.classList.add('visible');
      form.reset();
      setTimeout(() => {
        successAlert.classList.remove('visible');
      }, 8000);
    }
  });

  // Handle WhatsApp button action
  whatsappBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = {
      name: nameInput?.value || '',
      email: emailInput?.value || '',
      phone: phoneInput?.value || '',
      preferred: methodSelect?.value || 'WhatsApp',
      message: messageInput?.value || ''
    };

    openWhatsAppEnquiry(formData);
  });
}
