// Navigation utility to handle development vs production paths
export const getBasePath = () => {
  // In development, no base path
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  // In production, use the Next.js basePath
  return '/nextjs';
};

// Helper to create proper href for navigation
export const createHref = (path: string) => {
  // Next.js Link component handles basePath automatically
  // This is just for any manual navigation or external links
  const basePath = getBasePath();
  return `${basePath}${path}`;
};