import { TravelLuxuryEscapeHero } from '@/components/ui/TravelLuxuryEscapeHero';
import { Workspace } from '@/components/Workspace';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TravelLuxuryEscapeHero />

      <section className="py-12 px-4 w-full relative z-10 -mt-20">
        <Workspace />
      </section>
    </div>
  );
}
