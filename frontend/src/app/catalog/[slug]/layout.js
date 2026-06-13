export async function generateMetadata({ params }) {
  const { slug } = params;
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://www.hariramcars.com/backend/server.js?path=api';
  }

  try {
    const res = await fetch(`${baseUrl}/cars/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: 'Car Not Found' };

    const responseData = await res.json();
    const car = responseData.data || responseData; // Handle both wrapper styles just in case
    
    if (!car || !car.title) {
       return { title: 'Car Not Found' };
    }

    const name = car.title || `${car.year} ${car.make} ${car.model}`;
    const price = car.price
      ? `₹${(car.price / 100000).toFixed(1)} Lakh`
      : '';
    const km = car.kms
      ? `${car.kms.toLocaleString('en-IN')} km`
      : '';

    const title = `${name} for Sale in Surat`;
    const description = car.description
      || `Buy ${name}${price ? ` at ${price}` : ''}${km ? `, ${km} driven` : ''}, ${car.fuelType || ''} at Hariram Motors, Surat. Certified, documented, best price.`;
    const image = car.images?.[0]?.url
      ? car.images[0].url.replace(
          '/upload/',
          '/upload/w_1200,h_630,c_fill,q_auto,f_auto/'
        )
      : '/og-image.jpg';

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.hariramcars.com/catalog/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.hariramcars.com/catalog/${slug}`,
        type: 'website',
        images: [{
          url: image,
          width: 1200,
          height: 630,
          alt: name,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return { title: 'Car | Hariram Motors' };
  }
}

export default async function CarDetailLayout({ children, params }) {
  const { slug } = params;
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://www.hariramcars.com/backend/server.js?path=api';
  }
  
  let car = null;
  try {
    const res = await fetch(`${baseUrl}/cars/${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const responseData = await res.json();
      car = responseData.data || responseData;
    }
  } catch(e) {}

  return (
    <>
      {car && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Car",
              "name": car.title || `${car.year} ${car.make} ${car.model}`,
              "description": car.description,
              "brand": {
                "@type": "Brand",
                "name": car.make
              },
              "model": car.model,
              "modelDate": car.year?.toString(),
              "mileageFromOdometer": {
                "@type": "QuantitativeValue",
                "value": car.kms,
                "unitCode": "KMT"
              },
              "fuelType": car.fuelType,
              "vehicleTransmission": car.transmission,
              "color": car.color,
              "numberOfDoors": 4,
              "vehicleCondition": car.condition === 'new'
                ? "https://schema.org/NewCondition"
                : "https://schema.org/UsedCondition",
              "offers": {
                "@type": "Offer",
                "price": car.price,
                "priceCurrency": "INR",
                "availability": car.status === 'available'
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                "itemCondition": car.condition === 'new' 
                  ? "https://schema.org/NewCondition" 
                  : "https://schema.org/UsedCondition",
                "url": `https://www.hariramcars.com/catalog/${slug}`,
                "seller": {
                  "@type": "AutoDealer",
                  "name": "Hariram Motors"
                }
              },
              "image": car.images?.[0]?.url || '',
              "url": `https://www.hariramcars.com/catalog/${slug}`
            })
          }}
        />
      )}
      {children}
    </>
  );
}
