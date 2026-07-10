// Format price in INR (₹)
export function formatPrice(price) {
  if (!price && price !== 0) return 'Price on Request';
  
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Format large numbers (e.g., 45000 → "45,000 km")
export function formatKms(kms) {
  if (!kms && kms !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN').format(kms) + ' km';
}

// Generate WhatsApp link
export function getWhatsAppLink(phone, message = '') {
  let cleanPhone = phone?.replace(/[^0-9]/g, '') || '919876543210';
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

// Generate WhatsApp inquiry for a car
export function getCarInquiryLink(car, phone) {
  const title = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ''}`.trim();
  const message = `Hi! I'm interested in the ${title}${car.price ? ` priced at ${formatPrice(car.price)}` : ''}. Please share more details.`;
  return getWhatsAppLink(phone, message);
}

// Extract Image URL safely from various formats
export function extractImageUrl(img) {
  if (!img) return null;
  if (typeof img === 'string') {
    // Check if it's a JSON string by mistake
    if (img.startsWith('{') && img.includes('url')) {
      try {
        const parsed = JSON.parse(img);
        return parsed.url || parsed.secure_url || null;
      } catch (e) {
        return img;
      }
    }
    return img;
  }
  if (typeof img === 'object') {
    return img.url || img.secure_url || img.src || null;
  }
  return null;
}

// Get Cloudinary optimized URL
export function getOptimizedImage(url, width = 800) {
  let safeUrl = extractImageUrl(url);
  if (!safeUrl || typeof safeUrl !== 'string') return '/placeholder-car.svg';
  
  // Ensure HTTPS for Next.js Image component
  if (safeUrl.startsWith('http://')) {
    safeUrl = safeUrl.replace('http://', 'https://');
  }

  if (safeUrl.includes('cloudinary.com')) {
    // Avoid double transforming if already transformed
    if (safeUrl.includes('/upload/w_') || safeUrl.includes('/upload/q_') || safeUrl.includes('/upload/f_')) {
      return safeUrl;
    }
    return safeUrl.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  return safeUrl;
}

// Generate blur data URL for Next.js Image
export const generateBlurPlaceholder = () => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
};

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Slugify
export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Convert VAPID key to Uint8Array for Push Subscription
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
