import { easeInOut, motion } from "framer-motion";
import { Link2, PhoneForwarded } from "lucide-react";
import CardSwap, { Card } from "../components/CardSwap";
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

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
//   }),
// };
const TopSection = () => {
  const membersImages = [...developers, ...designers].flatMap((e) => e.image);
  return (
    <div className="flex flex-col md:flex-row justify-between items-center pt-20 pb-40 px-20 mb-8 relative ">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10"></div>
      <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
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
          className="inline-block bg-swamp text-white font-semibold py-3 px-8 rounded-full hover:bg-[#02543d] transition-all"
        >
          Contact Us
        </a>
      </div>

      <div
        style={{ height: "600px", position: "relative" }}
        className="hidden md:block"
      >
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={5000}
          pauseOnHover={false}
        >
          {membersImages.map((img, idx) => (
            <Card key={idx} className="overflow-hidden">
              <img src={img} alt="" className="object-cover w-full h-full" />
            </Card>
          ))}
        </CardSwap>
      </div>
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
    className="flex flex-col md:flex-row items-center  md:items-start gap-6 bg-white rounded-xl shadow-md p-6 md:p-8 h-auto"
  >
    <div className="w-full aspect-[4/3] md:aspect-[11/13] md:w-[395px] -[467px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src={member.image}
        alt={member.name}
        width={140}
        height={140}
        className="object-cover w-full h-full"
      />
    </div>

    <div className="flex-1 text-center md:text-left flex flex-col gap-px h-auto">
      <h3 className="text-[22px] font-semibold text-swamp">{member.name}</h3>
      <p className="text-gray-500 font-medium mb-3">{member.role}</p>
      <p className="text-gray-700 mb-6">{member.description}</p>
      <div className="flex gap-4 mt-auto">
        <a
          href={member.portfolio}
          className="border border-swamp text-swamp font-semibold px-6 py-2 rounded-2xl hover:bg-swamp hover:text-white transition-all duration-300 flex gap-2 items-center"
        >
          <Link2 size={20} />
          Portfolio
        </a>
        <a
          href=""
          className="bg-swamp text-white font-semibold py-3 px-8 rounded-2xl hover:bg-[#02543d] transition-all"
        >
          <PhoneForwarded size={20} />
        </a>
      </div>
    </div>
  </motion.div>
);

const TeamSection = ({ title, members }: TeamSectionProps) => (
  <section className="w-full max-w-5xl mx-auto my-16 px-4">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="inline-block bg-[#eaf4f1] text-swamp font-semibold py-2 px-4 rounded-md mb-8"
    >
      {title}
    </motion.h2>

    <div className="flex flex-col gap-10">
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
    image: "accbb9e05cf6d78eb3f26efadad987d1f381c0fa.png",
    portfolio: "#",
  },
];

const developers: Member[] = [
  {
    name: "Adewuyi Oyinda",
    role: "Frontend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "7bc5fa1064063587abd4ef80bff7028f79232637.jpg",
    portfolio: "#",
  },
  {
    name: "Chinonso Victor",
    role: "Backend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers who can solve the world’s most pressing technological challenges.",
    image: "a8d4886f6c041a3ceadada56d3e0274a3d98294d.jpg",
    portfolio: "#",
  },
];

export default function Teams() {
  return (
    <main className="bg-gray-50 min-h-screen mt-20 md:mt-0">
      <TopSection />

      <TeamSection title="Meet The Designers" members={designers} />
      <TeamSection title="Meet The Developers" members={developers} />
    </main>
  );
}
