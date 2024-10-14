import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';

export default function LandingPage() {
  const mottos = [
    'Showcase your life on Vitrine',
    'We ditched the metrics. You keep the moments',
    'Map your journey.',
    'Your life, on a timeline.',
  ];

  const timings = [1000, 1500, 1000, 1000]; 
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [fade, setFade] = useState(true); 
  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      router.push('/discover');
    }
  }, [user, router]);

  useEffect(() => {
    const changeMotto = () => {
      setFade(false); 
      setTimeout(() => {
        setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);
        setFade(true); 
      }, 500); 
    };

    const interval = setTimeout(() => {
      changeMotto();
    }, timings[currentMottoIndex]);

    return () => clearTimeout(interval); 
  }, [currentMottoIndex, timings]);

  return (
    <main className="text-gray-900">
      <header className="py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="w-32">
            <Image src="/logomini.png" alt="Vitrine Logo" width={128} height={40} />
          </div>
        </div>
      </header>

      <section className="pt-20 md:pt-40">
        <div className="container mx-auto px-8 lg:flex">
          <div className="text-center lg:text-left lg:w-1/2">
          <div className="min-h-[140px] md:min-h-[200px] lg:min-h-[200px] xl:min-h-[200px] 2xl:min-h-[250px]">
              <h1
                className={`text-4xl lg:text-5xl xl:text-6xl font-bold leading-none transition-opacity duration-500 ${
                  fade ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {mottos[currentMottoIndex]}
              </h1>
            </div>

            <p className="text-xl lg:text-2xl mt-6 font-light">
              Build your profile and tell your story.
            </p>
            <p className="mt-8 md:mt-12">
              <Link href="/register">
                <button type="button" className="py-4 px-12 bg-teal-500 hover:bg-teal-600 rounded text-white">
                  Get Started
                </button>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
