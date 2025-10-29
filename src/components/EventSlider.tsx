import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import React, { useCallback } from "react";

export const images = [
  {
    title: "Unilever Student Addressing",
    url: "hod.png",
  },
  {
    title: "Estrange Bond",
    url: "contentone.jpg",
  },
];

const EventSlider: React.FC = () => {
  const handleClick = useCallback((direction: "next" | "prev") => {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    const items = slider.querySelectorAll(".item");
    if (direction === "next" && items.length > 0) {
      slider.append(items[0]);
    } else if (direction === "prev" && items.length > 0) {
      slider.prepend(items[items.length - 1]);
    }
  }, []);

  return (
    <main className="relative w-full h-[70vh] md:h-screen shadow-md overflow-hidden flex items-center justify-center bg-black text-white snap-center">
      <ul className="slider relative w-full h-full">
        {images.map((img, index) => (
          <li
            key={index}
            className="item absolute bg-center bg-cover rounded-xl shadow-inner"
            style={{ backgroundImage: `url(${img.url})` }}
          >
            <div className="content absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-[max(30vw,200px)] font-sans opacity-0 text-white drop-shadow-lg hidden">
              <h2 className="title font-black uppercase">
                Unilever Student Addressing
              </h2>
              <div className="flex flex-col gap-2 items-start">
                <span className="flex gap-1 items-center">
                  <MapPin size={16} /> Sport Complex
                </span>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center justify-between text-sm text-gray-300">
                  <span className="flex gap-1 items-center ">
                    <Clock size={16} /> 10AM
                  </span>
                  <span className="flex gap-1 items-center">
                    <CalendarDays size={16} /> 27th Sept 2025
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <nav className="nav absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        <button
          className="btn bg-white/50 text-black/70 border border-black/60 rounded-full p-3 hover:bg-white/30 transition"
          onClick={() => handleClick("prev")}
        >
          <ArrowLeft />
        </button>
        <button
          className="btn bg-white/50 text-black/70 border border-black/60 rounded-full p-3 hover:bg-white/30 transition"
          onClick={() => handleClick("next")}
        >
          <ArrowRight />
        </button>
      </nav>
    </main>
  );
};

export default EventSlider;
