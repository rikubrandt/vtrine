import React from "react";
import GridSlider from "./GridSlider";

const Timeline = ({ displays }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    const options = { year: "numeric", month: "long", day: "numeric", hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
          <div className="w-full max-w-3xl mx-auto">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {displays
                .filter(display => display.createdAt) // Only render displays with a date
                .map((display, index) => (
                  <div
                    key={display.id}
                    className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${
                      display.isActive ? "is-active" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="10"
                      >
                        <path
                          fillRule="nonzero"
                          d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z"
                        />
                      </svg>
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">{display.title}</div>
                        <time className="text-xs font-medium text-indigo-500">
                          {formatDate(display.createdAt)}
                        </time>
                      </div>
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        {display.location?.place_name} 
                      </div>
                      <div className="text-slate-500">{display.caption}</div>
                      <div className="mt-2 text-right text-gray-400">
                        <span className="inline-block text-sm font-semibold">
                          ♥ {display.heartCount}
                        </span>
                      </div>
                      {/* GridSlider */}
                      {display.files && display.files.length > 0 && (
                        <div className="mt-4">
                          <GridSlider post={display.files.map((url, i) => ({
                            id: `${display.id}-${i}`,
                            downloadURL: url,
                          }))} title={display.title} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
