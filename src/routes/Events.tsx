import { images } from "../components/EventSlider";

interface EventHighlightProps {
  imageSrc: string;
}

const EventHighlight: React.FC<EventHighlightProps> = ({ imageSrc }) => (
  <img
    src={imageSrc}
    alt="Event Highlight"
    className="w-14 h-14 md:w-25 md:h-25 object-cover rounded-md"
  />
);

interface EventCardProps {
  title: string;
  imageSrc: string;
  location: string;
  time: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  imageSrc,
  location,
  time,
}) => (
  <div className="shadow-sm w-auto min-h-[350px] md:h-[411px] md:w-[515px] relative overflow-hidden rounded-[20px] bg-black/40 flex flex-col px-4 py-2">
    <img
      src={imageSrc}
      alt={title}
      className="md:w-[515px] md:h-[411px] object-cover absolute inset-0 -z-2 aspect-square"
    />
    <div className="p-4 text-white flex flex-col mt-auto items-start">
      <h3 className="text-xl md:text-[24px] font-semibold">{title}</h3>
      <div className="text-sm mt-2 flex gap-8 items-center">
        <p className="flex gap-1 items-center">
          <MapPin size={16} />
          {location}
        </p>
        <p className="flex gap-1 items-center">
          <Clock size={16} /> {time}
        </p>
      </div>
    </div>
  </div>
);

interface EventTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const EventTabs: React.FC<EventTabsProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => (
  <div className="flex gap-4 bg-[#E0E0E087] p-2 md:px-6 md:py-4 w-full md:w-fit mx-auto my-12 rounded-xl">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabClick(tab)}
        className={`px-3 md:px-6 py-2 font-medium transition-colors text-sm md:text-lg ${
          tab === activeTab ? "bg-swamp rounded-xl text-white" : "text-gray-600"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);
import { ArrowUpRight, CalendarDays, Clock, MapPin, Play } from "lucide-react";

import { useState } from "react";
import ImageSlider from "../components/ImageSlider";

const Events = () => {
  const [activeTab, setActiveTab] = useState("Corporate events");

  const tabs = ["Corporate events", "Sport events", "Fun events"];

  return (
    <div className="mx-auto w-full pb-8">
      <div className="overflow-y-auto md:h-screen scrollbar">
        <div className="relative w-full  overflow-hidden h-screen flex flex-col items-center justify-center ">
          <ImageSlider
            images={images.map((_) => _.url)}
            className="!absolute -z-2"
          />
          <div className="absolute inset-0 bg-white/50 bg-opacity-50 p-6 flex flex-col justify-end -z-1"></div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-[64px] font-semibold">All Events</h1>
            <span className="text-[24px] font-semibold">
              View catchy and exciting stories from past and upcoming events
            </span>
          </div>
        </div>
      </div>

      <div className="lg:w-[80%] md:w-[90%] w-[95%] rounded-2xl h-[50vh] md:h-screen flex my-16  mx-auto overflow-hidden relative">
        <div className="flex flex-col gap-2 text-white mt-auto p-6 md:p-12 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Unilever student addressing
          </h2>
          <div className="flex gap-4 md:gap-6 md:items-center justify-between items-start text-gray-200 text-sm md:text-base">
            <div className="flex md:flex-row flex-col gap-2 md:gap-6">
              <span className="flex gap-1 items-center">
                <MapPin size={16} /> Sports Complex
              </span>
              <span className="flex gap-1 items-center">
                <Clock size={16} /> 10:00AM
              </span>
            </div>
            <span className="flex gap-1 items-center">
              <CalendarDays size={16} /> 27th Sept. 2025
            </span>
          </div>
        </div>
        <img
          src="contentone.jpg"
          alt=""
          className="absolute -z-2 inset-0 aspect-[16/9] object-cover w-full h-full"
        />
        <div className="absolute inset-0 -z-1 bg-black/40 flex items-center justify-center">
          <Play className="fill-current text-white" size={40} />
        </div>
      </div>

      <EventTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="flex flex-col gap-12 max-w-7xl px-8  mx-auto">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center"
          >
            <EventCard
              title="SEES Sports Tournament"
              imageSrc="contentone.jpg"
              location="Sport Complex"
              time="12:00 am"
            />
            <div className="flex flex-col-reverse  justify-between flex-wrap gap-4">
              <p className="text-sm md:text-base text-swamp font-medium cursor-pointer ml-auto md:ml-0 flex gap-[2px] items-center hover:text-swamp/60 transition-colors">
                View full highlights <ArrowUpRight size={16} />
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((h) => (
                  <EventHighlight key={h} imageSrc="contentone.jpg" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
