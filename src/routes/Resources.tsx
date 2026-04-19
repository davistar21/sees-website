import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, type Resource } from "../lib/supabase";

const iconMap: Record<Resource["type"], string> = {
  lesson_notes: "/book-icon.png",
  youtube: "/logos_youtube-icon.png",
  tutorial: "/video-icon.png",
  textbook: "/textbk-icon.png",
};

const baseImageMap: Record<Resource["type"], string> = {
  lesson_notes: "/0e285ca1840408695f54ab571e2874db961425de.jpg",
  youtube: "/055b92ccf143379da169a3404fe022d1dcd52614.png",
  tutorial: "/ca54ef4c59cb366fb4121db986628968c0ccf6e2.png",
  textbook: "/8386c1fdb2705750a10050f8b7bbcfda0ebadf92.png",
};

const bgMap: Record<Resource["type"], string> = {
  lesson_notes: "bg-[#e2ffe7] rotate-[12.84deg]",
  youtube: "bg-[#ffdede] -rotate-[13.84deg]",
  tutorial: "bg-[#e0e0ff] -rotate-[13.84deg]",
  textbook: "bg-[#fbf4d4] rotate-[12.84deg]",
};

const titleMap: Record<Resource["type"], string> = {
  lesson_notes: "Lesson Notes",
  youtube: "YouTube Links",
  tutorial: "Tutorial Videos",
  textbook: "Textbooks",
};

// Deduplicated resource type cards — one card per type
type ResourceCardProps = {
  type: Resource["type"];
  url?: string | null;
};

const ResourceCard: React.FC<ResourceCardProps> = ({ type, url }) => (
  <a
    href={url ?? "#"}
    target={url ? "_blank" : undefined}
    rel="noreferrer"
    className={`flex flex-col items-center justify-center gap-4 py-12 bg-[#E0E0E0]/80 rounded-3xl w-[365px] h-[304px] md:w-[662px] md:h-[552px] hover:opacity-90 transition-opacity`}
  >
    <div className="relative w-full max-w-xs md:aspect-square flex flex-col items-center">
      <div className="bg-[#3e5e74] rounded-3xl w-fit">
        <img
          src={baseImageMap[type]}
          alt={titleMap[type]}
          className="w-[150px] h-[147px] md:w-[272px] md:h-[266px] object-cover rounded-3xl"
        />
      </div>
      <div
        className={`absolute bottom-1/2 right-12 md:bottom-6 md:-right-8 w-[92px] h-[90px] md:w-[167px] md:h-[164px] rounded-lg shadow-2xl flex items-center justify-center ${bgMap[type]}`}
      >
        <img
          src={iconMap[type]}
          alt={`${titleMap[type]} icon`}
          className="w-[53px] h-[58px] object-contain"
        />
      </div>
    </div>
    <p className="text-gray-900 font-[700] text-center text-[22px] md:text-[38px]">
      {titleMap[type]}
    </p>
  </a>
);

const levels = [100, 200, 300, 400, 500];

const Resources = () => {
  const [resourceTypes, setResourceTypes] = useState<
    { type: Resource["type"]; url: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fallback static types shown when DB is empty
  const fallbackTypes: { type: Resource["type"]; url: null }[] = [
    { type: "lesson_notes", url: null },
    { type: "youtube", url: null },
    { type: "tutorial", url: null },
    { type: "textbook", url: null },
  ];

  useEffect(() => {
    supabase
      .from("resources")
      .select("type, url")
      .then(({ data }) => {
        if (data && data.length > 0) {
          // One card per type, use the first url found for that type
          const seen = new Map<Resource["type"], string | null>();
          for (const r of data as Pick<Resource, "type" | "url">[]) {
            if (!seen.has(r.type)) seen.set(r.type, r.url);
          }
          setResourceTypes(
            Array.from(seen.entries()).map(([type, url]) => ({ type, url }))
          );
        } else {
          setResourceTypes(fallbackTypes);
        }
        setLoading(false);
      });
  }, []);

  const displayed = loading ? fallbackTypes : resourceTypes;

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center mb-8">
          <h1 className="md:text-[64px] font-semibold text-[35px]">
            Our Resources
          </h1>
          <span className="text-base md:text-[24px]">
            Our resources include various learning solutions
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-8 md:w-fit w-full">
            {displayed.map((r) => (
              <ResourceCard key={r.type} type={r.type} url={r.url} />
            ))}
          </div>
          <div className="ml-auto mt-8 text-[#787878] hover:text-gray-800 text-lg md:text-xl flex gap-2 items-end transition-all cursor-pointer group relative">
            Learn more <MoveRight size={20} />
            <div className="hidden md:block absolute h-px md:h-[2px] w-full bottom-0 left-0 bg-swamp scale-x-0 group-hover:scale-x-100 transition ease-in-out duration-500"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="text-center my-8">
          <h1 className="md:text-[64px] font-semibold text-[35px]">
            Our Levels
          </h1>
          <span className="text-base md:text-[24px]">
            Our resources span the following levels
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:flex-row flex-col max-md:max-w-[80%] w-full">
          {levels.map((num) => (
            <Link
              to="#"
              key={num}
              className="bg-swamp/20 py-4 px-6 md:w-fit w-full md:min-w-[380px] rounded-md scale-100 hover:scale-101 transition font-medium text-center text-xl relative overflow-hidden"
            >
              {num} Level
              <div className="absolute w-full h-[5px] bottom-0 left-0 bg-swamp"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
