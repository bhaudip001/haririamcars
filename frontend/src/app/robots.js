export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://www.hariramcars.com/sitemap.xml',
    host: 'https://www.hariramcars.com',
  };
}
