import React from "react";
import GridSlider from "./GridSlider";
import { MapPinIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow, parseISO } from "date-fns";

const Timeline = ({ displays }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = parseISO(dateString);
    const now = new Date();

    const difference = now - date;

    // If the difference is more than 2 months (60 days), return the full date
    const maxRelativeTime = 60 * 24 * 60 * 60 * 1000; 

    if (difference > maxRelativeTime) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options); // Full date if older than 2 months
    }

    return `${formatDistanceToNow(date)} ago`;
  };
  
    const sortedDisplays = displays
      .filter((display) => display.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {sortedDisplays.map((display) => (
            <div
              key={display.id}
              className="border-l-2 border-gray-300 flex flex-col"
            >
              <div className="flex ml-2 flex-start items-start">
                <div className="w-6 h-6 flex items-center justify-center rounded-full -ml-3.5 bg-gray-300">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    className="text-white w-3 h-3"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8
                      0 16 7.2 16 16v64c0 8.8-7.2 16-16
                      16H80c-8.8 0-16-7.2-16-16v-64zM400
                      64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8
                      0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8
                      0-16 7.2-16 16v48H48C21.5 64 0 85.5
                      0 112v48h448v-48c0-26.5-21.5-48-48-48z"
                    ></path>
                  </svg>
                </div>
                <div className="block p-4 rounded-lg shadow-lg bg-gray-100 flex-grow ml-4">
                  <div className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    {formatDate(display.date)}
                  </div>

                  {display.files && display.files.length > 0 && (
                    <div className="mt-4">
                      <GridSlider
                        post={display.files.map((file, i) => ({
                          id: `${display.id}-${i}`,
                          downloadURL: file,
                          aspectRatio: file.aspectRatio,
                        }))}
                        title={display.title}
                      />
                    </div>
                  )}

                  <div className="font-bold text-gray-900 text-xl mb-2 pt-2 pl-2">
                    {display.title}
                  </div>

                  {display.location?.place_name && (
                    <div className="flex items-center mb-2 pl-2">
                    <div className="text-sm font-medium text-laurelgreen">
                      <MapPinIcon className="h-5 w-5"/>
                      </div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                      {display.location.place_name}
                    </div>
                    </div>
                  )}
                  <div className="text-gray-700 pl-5">{display.caption}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
