import DeliveryReelClient from '../client/DeliveryReelClient';

// In the future, this can be an async function fetching data from your backend.
export default async function DeliveryReelServer() {
  
  // Dummy data representing deliveries
  const initialReels = [
    {
      id: 1,
      videoSrc: '/IMG_5513.MOV',
      customerName: 'Rahul Patel',
      carModel: 'Hyundai Creta 2022',
      review: 'Amazing experience! Got my dream car delivered in perfect condition.',
    },
    {
      id: 2,
      videoSrc: '/IMG_5502.MP4',
      customerName: 'Anjali Sharma',
      carModel: 'Kia Seltos',
      review: 'Smooth process from start to finish. Highly recommended dealership!',
    },
    {
      id: 3,
      videoSrc: '/IMG_5513.MOV',
      customerName: 'Vikram Singh',
      carModel: 'Honda City',
      review: 'Very transparent pricing and excellent customer service.',
    },
    {
      id: 4,
      videoSrc: '/IMG_5502.MP4',
      customerName: 'Neha Gupta',
      carModel: 'Maruti Suzuki Baleno',
      review: 'Loved the fast delivery and the car looks brand new!',
    }
  ];

  return <DeliveryReelClient initialReels={initialReels} />;
}
