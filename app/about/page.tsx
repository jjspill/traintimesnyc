// components/TrainsAboutPage.tsx
'use client';

import React from 'react';
import { TrainCarousel, TrainSymbolsDisplay } from '../TrainComponents';

const TrainsAboutPage: React.FC = () => {
  return (
    <div className="flex justify-center items-start pt-20 px-4 pb-4">
      <div className="min-h-[100vh] bg-[#FFEDD5] shadow-xl rounded-3xl overflow-hidden w-full max-w-4xl">
        <div className="relative flex flex-col justify-center items-center w-full min-h-20 h-fit bg-black text-center font-semibold text-white py-2 font-sans">
          <div className="min-h-[2px] w-[90%] md:w-[80%] bg-white"></div>
          <div className="flex">
            <div className="text-pretty text-3xl px-4">Train Times NYC</div>
          </div>
          <div className="block md:hidden">
            <TrainCarousel />
          </div>
          <div className="hidden md:block">
            <TrainSymbolsDisplay />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8 text-gray-700">
          <section aria-labelledby="mission-title">
            <h2 id="mission-title" className="text-2xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mt-2">
              Train Times NYC is dedicated to revolutionizing how New Yorkers
              access real-time subway information. Our platform ensures that
              millions of daily commuters and visitors can navigate the
              extensive subway network efficiently and with ease, providing live
              updates on schedules, delays, and service changes.
            </p>
          </section>

          <section aria-labelledby="how-it-works-title" className="mt-6">
            <h2
              id="how-it-works-title"
              className="text-2xl font-bold text-gray-900"
            >
              How It Works
            </h2>
            <ul className="list-disc pl-5 mt-2">
              <li>
                <strong>GTFS Realtime:</strong> Leveraging real-time data feeds
                from the MTA, we provide updates on subway locations, trip
                delays, and service alerts directly to your device.
              </li>
              <li>
                <strong>GTFS Schedule:</strong> We integrate static MTA schedule
                data to offer detailed insights into station stops, route
                timetables, and service frequencies.
              </li>
              <li>
                <strong>Custom Software Integration:</strong> Our
                custom-developed backend system ensures efficient processing and
                integration of diverse data sources for optimal performance.
              </li>
              <li>
                <strong>User-Friendly Interface:</strong> Our application is
                designed to be intuitive and responsive, providing a seamless
                user experience across various devices.
              </li>
            </ul>
          </section>

          <section aria-labelledby="why-gtfs-title" className="mt-6">
            <h2
              id="why-gtfs-title"
              className="text-2xl font-bold text-gray-900"
            >
              Why We Use GTFS
            </h2>
            <p>
              The General Transit Feed Specification (GTFS) is a critical
              framework that allows for the uniform representation of public
              transit data. Adopted globally, GTFS enables our service to
              maintain high standards of accuracy and reliability.
              <strong> History of GTFS:</strong> Originally developed by Google
              and Portland&apos;s TriMet in 2005, GTFS has evolved to become the
              worldwide standard used by transit agencies to provide the public
              with accessible transit information.
            </p>
          </section>

          <section aria-labelledby="commitment-title" className="mt-6">
            <h2
              id="commitment-title"
              className="text-2xl font-bold text-gray-900"
            >
              Our Commitment to Quality
            </h2>
            <p>
              At Train Times NYC, we are committed to the highest standards of
              data integrity. Our team works tirelessly to ensure our data is
              up-to-date and reflective of real-time MTA conditions, empowering
              you with the information needed to make informed travel decisions.
            </p>
          </section>

          <section aria-labelledby="future-title" className="mt-6">
            <h2 id="future-title" className="text-2xl font-bold text-gray-900">
              Looking Ahead
            </h2>
            <p>
              We are continuously working to enhance our services, with plans to
              incorporate personalized trip planning tools and improved
              accessibility features to cater to all New Yorkers and visitors
              alike.
            </p>
          </section>

          <section aria-labelledby="testimonials-title" className="mt-6">
            <h2
              id="testimonials-title"
              className="text-2xl font-bold text-gray-900"
            >
              What Our Users Say
            </h2>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Train Times NYC has transformed how I plan my daily commute. The
                real-time updates have saved me countless hours.
                <em> Jack Ferber, Regular Commuter</em>
              </li>
              <li>
                Thanks to Train Times NYC, I avoided a major delay during a
                city-wide event and made it to my meeting on time.
                <em> Zad Khan, Business Professional</em>
              </li>
            </ul>
          </section>

          <section aria-labelledby="contact-title" className="mt-6">
            <h2 id="contact-title" className="text-2xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p>
              Interested in how Train Times NYC can improve your commute or
              looking to collaborate? Reach out to us at{' '}
              <a
                href="jjspill@umich.edu"
                className="text-blue-600 hover:text-blue-800"
              >
                jjspill@umich.edu
              </a>
              , or follow us on social media to stay updated with the latest
              developments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TrainsAboutPage;
