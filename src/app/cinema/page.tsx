import type { Metadata } from 'next';
import { CinemaLandingPage } from '@/components/cinema/CinemaLandingPage';

export const metadata: Metadata = {
  title: 'Deadpool III — Theatrical Premiere | Nature Studios Cinema',
  description:
    'Experience the cinematic theatrical landing page for Deadpool III. IMAX dual-laser roadshow, interactive 3D character suit deck, production radar specifications, and premiere pass reservations.',
  openGraph: {
    title: 'Deadpool III — Theatrical Premiere | Nature Studios Cinema',
    description:
      'Official theatrical experience and interactive landing page featuring 3D suit deck, radar dials, and IMAX booking.',
    images: ['/media/cinema/deadpool-70.png'],
  },
};

export default function CinemaPage() {
  return <CinemaLandingPage showStudioToggle={true} />;
}
