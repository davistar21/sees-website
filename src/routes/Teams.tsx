import { easeInOut, motion } from "framer-motion";
import { Link2, PhoneForwarded } from "lucide-react";
type Member = {
  name: string;
  role: string;
  description: string;
  image: string;
  portfolio: string;
};

type TeamSectionProps = {
  title: string;
  members: Member[];
};

const Carousel = () => {
  const membersImages = [...developers, ...designers].flatMap((e) => e.image);
  membersImages.push("contentone.jpg");
  // const currentIndex = Math.ceil(membersImages.length / 2);
  // const calculateTransform = (index: number) => {
  //   const offset = index - currentIndex; // negative = left, positive = right
  //   const rotateY = offset * -10; // adjust this for curvature intensity
  //   const translateZ = -Math.abs(offset) * 0; // push side images back a bit
  //   const translateX = offset * 60; // space them apart horizontally

  //   return `
  //   rotateY(${rotateY}deg)
  //   translateZ(${translateZ}px)
  // `;
  // };
  return (
    <div className="flex gap-2 w-auto overflow-x-auto scrollbar snap-x snap-mandatory">
      {membersImages.map((image, idx) => (
        <img
          src={image}
          alt={`carousel-image-${idx}`}
          className="w-[250px] h-auto object-cover aspect-square rounded-2xl snap-center"
        />
      ))}
    </div>
  );
};

const TopSection = () => {
  return (
    <div className="flex flex-col justify-between items-center md:pt-20 pb-40 px-6 md:px-16 mb-8 relative gap-8">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10"></div>
      <div className="flex flex-col gap-1 items-center  text-center ">
        <h1 className="text-3xl md:text-5xl font-bold text-swamp mb-4">
          Meet the Team <br />{" "}
          <span className="text-gray-700">Visionaries</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
          This team put together the functionality and design of the society of
          electrical and engineering students website together.
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
const TeamMemberCard = ({
  member,
  index,
}: {
  member: Member;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: easeInOut }}
    viewport={{ once: true, amount: 0.3 }}
    custom={index}
    className="flex flex-col md:flex-row items-center  gap-8 md:gap-20 rounded-xl h-auto"
  >
    <div className="w-full aspect-[4/3] md:aspect-[11/13] md:w-[395px]  flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src={member.image}
        alt={member.name}
        width={140}
        height={140}
        className="object-cover w-full h-full"
      />
    </div>

    <div className="flex-1 text-center md:text-left flex flex-col gap-px h-full min-h-[380px]">
      <h3 className="text-[36px] font-semibold text-swamp">{member.name}</h3>
      <p className="text-gray-500 font-medium mb-3 text-base">{member.role}</p>
      <p className="text-gray-700 mb-6 text-xl">{member.description}</p>
      <div className="flex gap-4 mt-4 md:mt-auto justify-around md:justify-start">
        <a
          href={member.portfolio}
          className="border border-swamp text-white font-semibold px-6 py-2 rounded-2xl bg-swamp hover:text-green-200 transition-all duration-300 flex gap-2 items-center"
        >
          <Link2 size={20} />
          Portfolio
        </a>
        <a
          href=""
          className="border-2 border-swamp text-swamp font-semibold py-3 px-8 rounded-2xl hover:text-green-500 transition-all"
        >
          <PhoneForwarded size={20} />
        </a>
      </div>
    </div>
  </motion.div>
);

const TeamSection = ({ title, members }: TeamSectionProps) => (
  <section className="w-full max-w-7xl mx-auto my-24 px-4">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="inline-block bg-[#36CE8A26] text-swamp font-semibold py-4 px-8 rounded-[10px] mb-8 text-xl"
    >
      {title}
    </motion.h2>

    <div className="flex flex-col gap-16">
      {members.map((member, i) => (
        <TeamMemberCard member={member} key={i} index={i} />
      ))}
    </div>
  </section>
);
const designers: Member[] = [
  {
    name: "Adewuyi Oyinda",
    role: "UI/UX Designer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "6789d9097fc06f5b98c29b73ab472ff52652d2f8.png",
    portfolio: "#",
  },
  {
    name: "Chinonso Victor",
    role: "Graphic Designer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "contentone.jpg",
    portfolio: "#",
  },
];

const developers: Member[] = [
  {
    name: "Adewuyi Oyinda",
    role: "Frontend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "contenttwo.jpg",
    portfolio: "#",
  },
  {
    name: "Chinonso Victor",
    role: "Backend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "hod.png",
    portfolio: "#",
  },
];

export default function Teams() {
  return (
    <main className="bg-gray-50 min-h-screen mt-20 md:mt-0 py-20">
      <TopSection />

      <TeamSection title="Meet The Designers" members={designers} />
      <TeamSection title="Meet The Developers" members={developers} />
    </main>
  );
}
