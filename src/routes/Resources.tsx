import { ArrowRight } from "lucide-react";

const Resources = () => {
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
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 md:w-fit w-full">
            {resources.map((resource, index) => (
              <Resource {...resource} key={index} />
            ))}
          </div>
          <p className="ml-auto mt-8 text-[#787878] text-xl flex gap-2 items-center hover:underline">
            Learn more <ArrowRight size={20} />
          </p>
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
        <div className="flex flex-wrap justify-center gap-4 md:flex-row flex-col max-w-[80%] w-full">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="bg-swamp/20 py-4 px-6 w-full md:min-w-[380px] rounded-md scale-100 hover:scale-101 transition font-medium text-center text-xl telative overflow-hidden"
            >
              {num * 100} Level
              <div className="absolute w-full h-[5px] bottom-0 left-0 bg-swamp"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;

type ResourceProps = {
  title: string;
  baseImageSrc: string;
  iconImageSrc: string;
  className?: string;
};

const resources: ResourceProps[] = [
  {
    title: "Lesson Notes",
    baseImageSrc: "/0e285ca1840408695f54ab571e2874db961425de.jpg",
    iconImageSrc: "/book-icon.png",
    className: "bg-[#e2ffe7] rotate-[12.84deg]",
  },
  {
    title: "YouTube Links",
    baseImageSrc: "/055b92ccf143379da169a3404fe022d1dcd52614.png",
    iconImageSrc: "logos_youtube-icon.png",
    className: "bg-[#ffdede] -rotate-[13.84deg]",
  },
  {
    title: "Tutorial Videos",
    baseImageSrc: "ca54ef4c59cb366fb4121db986628968c0ccf6e2.png",
    iconImageSrc: "/video-icon.png",
    className: "bg-[#e0e0ff] -rotate-[13.84deg]",
  },
  {
    title: "Textbooks",
    baseImageSrc: "8386c1fdb2705750a10050f8b7bbcfda0ebadf92.png",
    iconImageSrc: "/textbk-icon.png",
    className: "bg-[#fbf4d4] rotate-[12.84deg]",
  },
];

const Resource: React.FC<ResourceProps> = ({
  title,
  baseImageSrc,
  iconImageSrc,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center gap-4 py-12 bg-[#E0E0E0]/80 rounded-3xl w-[365px] h-[304px] md:w-[662px] md:h-[552px]`}
  >
    <div className="relative w-full max-w-xs md:aspect-square flex flex-col items-center  ">
      <div className="bg-[#3e5e74] rounded-3xl w-fit">
        <img
          src={baseImageSrc}
          alt={title}
          className="w-[150px] h-[147px] md:w-[272px] md:h-[266px] object-cover rounded-3xl"
        />
      </div>
      <div
        className={`absolute bottom-1/2 right-12 md:bottom-6 md:-right-8 w-[92px] h-[90px] md:w-[167px] md:h-[164px] rounded-lg shadow-2xl flex items-center justify-center ${className}`}
      >
        <img
          src={iconImageSrc}
          alt={`${title} icon`}
          className="w-[53px] h-[58px] object-contain"
        />
      </div>
    </div>
    <p className="text-gray-900 font-[700] text-center text-[22px] md:text-[38px]">
      {title}
    </p>
  </div>
);
