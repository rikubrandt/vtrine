import React from "react";
import GridSlider from "./GridSlider";

const Timeline = ({ displays }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime) return '';
    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = endTime ? ` - ${formatDate(endTime)}` : '';
    return `${formattedStartTime}${formattedEndTime}`;
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24">
        <h3 className="text-2xl text-gray-700 font-bold mb-6 ml-3">Timeline</h3>
        <ol className="space-y-8">
          {displays
            .filter(display => display.createdAt) // Only render displays with a date
            .map((display) => (
              <li key={display.id} className={`border-l-2 ${display.isActive ? 'border-emerald-600' : 'border-gray-300'}`}>
                <div className="md:flex flex-start items-start">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full -ml-3.5 ${display.isActive ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" className="text-white w-3 h-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
                    </svg>
                  </div>
                  <div className="block p-6 rounded-lg shadow-lg bg-gray-100 flex-grow ml-6 mb-10">
                    <div className="text-sm font-medium text-purple-600 mb-2">
                      {formatTimeRange(display.startTime, display.endTime) || formatDate(display.createdAt)}
                    </div>
                    <div className="font-bold text-gray-800 text-xl mb-2">
                      {display.title}
                    </div>
                    {display.location?.place_name && (
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        {display.location.place_name}
                      </div>
                    )}
                    <div className="text-gray-700 mb-4">
                      {display.caption}
                    </div>
                    {display.files && display.files.length > 0 && (
                      <div className="mt-4">
                        <GridSlider
                          post={display.files.map((url, i) => ({
                            id: `${display.id}-${i}`,
                            downloadURL: url,
                          }))}
                          title={display.title}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
};

export default Timeline;
