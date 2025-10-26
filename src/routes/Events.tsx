import EventSlider, { images } from "../components/EventSlider";

interface EventHighlightProps {
  imageSrc: string;
}

const EventHighlight: React.FC<EventHighlightProps> = ({ imageSrc }) => (
  <img
    src={imageSrc}
    alt="Event Highlight"
    className="w-16 h-16 md:w-25 md:h-25 object-cover rounded-md"
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
  <div className=" shadow-sm w-auto min-h-[250px] md:h-[411px] md:w-[515px] relative overflow-hidden rounded-[20px] bg-black/40 flex flex-col px-4 py-2">
    <img
      src={imageSrc}
      alt={title}
      className="md:w-[515px] md:h-[411px] object-cover absolute inset-0 -z-2"
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
  <div className="flex gap-4 bg-gray-100 p-2 rounded-full w-fit mx-auto my-6">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabClick(tab)}
        className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-lg ${
          tab === activeTab
            ? "bg-[#B0C4BE] text-black border-b-4 border-[#00473E]"
            : "text-gray-600"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);
import { ArrowUpRight, Clock, MapPin } from "lucide-react";

import { useState } from "react";
import ImageSlider from "../components/ImageSlider";

const Events = () => {
  const [activeTab, setActiveTab] = useState("Corporate events");

  const tabs = ["Corporate events", "Sport events", "Fun events"];

  return (
    <div className="mx-auto w-full pb-8">
      <div className="snap-y snap-mandatory  overflow-y-auto md:h-screen scrollbar">
        <div className="relative w-full  overflow-hidden h-screen flex flex-col items-center justify-center snap-center">
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

        <EventSlider />
      </div>

      <EventTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="flex flex-col gap-8 max-w-7xl px-8  mx-auto">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center"
          >
            <EventCard
              title="SEES Sports Tournament"
              imageSrc="7bc5fa1064063587abd4ef80bff7028f79232637.jpg"
              location="Sport Complex"
              time="12:00 am"
            />
            <div className="flex flex-col-reverse  justify-between flex-wrap gap-4">
              <p className="text-base md:text-[24px] text-swamp font-medium cursor-pointer ml-auto md:ml-0 flex gap-[2px] items-center hover:text-swamp/60 transition-colors">
                View full highlights <ArrowUpRight size={16} />
              </p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((h) => (
                  <EventHighlight
                    key={h}
                    imageSrc="7bc5fa1064063587abd4ef80bff7028f79232637.jpg"
                  />
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
