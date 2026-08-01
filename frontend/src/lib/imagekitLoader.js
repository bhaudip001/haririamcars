// Custom loader for Next.js Image component to use ImageKit's dynamic resizing
// This bypasses Vercel's native image optimization to save bandwidth costs

export default function imageKitLoader({ src, width, quality }) {
  if (!src) return '';
  
  // If the src is already an ImageKit URL, we can append transformations
  if (src.includes('ik.imagekit.io')) {
    // If it already has transformations, just return it
    if (src.includes('?tr=')) return src;

    // Apply the requested width and quality
    const q = quality || 80;
    return `${src}?tr=w-${width},q-${q}`;
  }

  // If it's a relative path (local asset), just return it as is
  if (src.startsWith('/')) {
    return src;
  }

  return src;
}
