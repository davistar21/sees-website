import { Carousel, TeamSection, type Member } from "./Teams";

const TopSection = () => {
  return (
    <div className="flex flex-col justify-between items-center md:pt-20 pb-40 px-6 md:px-16 mb-8 relative gap-8">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10"></div>
      <div className="flex flex-col gap-1 items-center  text-center ">
        <h1 className="text-3xl md:text-5xl font-bold text-swamp mb-4">
          Meet the Executives <br />{" "}
          {/* <span className="text-gray-700">Visionaries</span> */}
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
          The executives of the Society of Electrical Engineering Students
        </p>
        <a
          href="/contact"
          className="inline-block bg-swamp text-white font-semibold py-3 px-8 rounded-2xl hover:bg-[#02543d] transition-all"
        >
          Contact Us
        </a>
      </div>
      <Carousel />
    </div>
  );
};
const developers: Member[] = [
  {
    name: "Prof. Adewuyi Oyinda",
    role: "Executive",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "contenttwo.jpg",
    portfolio: "#",
  },
  {
    name: "Dr. Chinonso Victor",
    role: "Executive",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "hod.png",
    portfolio: "#",
  },
];

const Executives = () => {
  return (
    <main className="bg-gray-50 min-h-screen mt-20 md:mt-0 py-20">
      <TopSection />
      <TeamSection title="Meet the Executives" members={developers} />
    </main>
  );
};

export default Executives;
