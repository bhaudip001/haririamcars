export default function cloudinaryLoader({ src, width, quality }) {
  // If the image isn't from Cloudinary, just return the source (e.g. Unsplash or local)
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  // Split at '/upload/' to insert dynamic resizing transforms
  const parts = src.split('/upload/');
  if (parts.length !== 2) return src;

  const q = quality || 'auto';
  const transforms = `w_${width},q_${q},f_auto`;

  // Remove existing hardcoded transforms (like w_600, q_auto) if they already exist in the DB url
  let imagePath = parts[1];
  const pathSegments = imagePath.split('/');
  
  if (pathSegments.length > 1 && (pathSegments[0].includes('w_') || pathSegments[0].includes('q_') || pathSegments[0].includes('f_'))) {
    // Drop the hardcoded transform segment
    pathSegments.shift();
    imagePath = pathSegments.join('/');
  }

  // Construct the final dynamically resized Cloudinary URL
  return `${parts[0]}/upload/${transforms}/${imagePath}`;
}
