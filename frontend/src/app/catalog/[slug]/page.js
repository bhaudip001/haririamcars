import { notFound } from 'next/navigation';
import CarDetailPageClient from '@/components/CarDetailPageClient';

export const revalidate = 3600;

async function getCarData(slug) {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://www.hariramcars.com/backend/server.js?path=api';
  }
  try {
    const res = await fetch(`${baseUrl}/cars/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { car: null, similarCars: [] };
    
    const responseData = await res.json();
    const car = responseData.data || responseData;
    
    // Fetch similar cars
    let similarRes = await fetch(`${baseUrl}/cars?make=${car.make}&status=available&limit=4`, { next: { revalidate: 3600 } });
    let similarData = similarRes.ok ? await similarRes.json() : { cars: [] };
    let filtered = (similarData.cars || []).filter(c => c._id !== car._id);
    
    if (filtered.length === 0) {
      similarRes = await fetch(`${baseUrl}/cars?status=available&limit=4`, { next: { revalidate: 3600 } });
      similarData = similarRes.ok ? await similarRes.json() : { cars: [] };
      filtered = (similarData.cars || []).filter(c => c._id !== car._id);
    }
    
    return { car, similarCars: filtered.slice(0, 3) };
  } catch (error) {
    console.error("Failed to fetch car data server-side:", error);
    return { car: null, similarCars: [] };
  }
}

export default async function CarDetailPageServer({ params }) {
  const { slug } = params;
  const { car, similarCars } = await getCarData(slug);
  
  if (!car) {
    notFound();
  }

  return <CarDetailPageClient initialCar={car} initialSimilarCars={similarCars} />;
}
