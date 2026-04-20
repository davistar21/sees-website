import { easeInOut, motion } from "framer-motion";
import { Link2, PhoneForwarded } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Member = {
  name: string;
  role: string;
  description: string;
  image: string;
  portfolio: string;
};

// ---------------------------------------------------------------------------
// Auto-scrolling infinite carousel
// ---------------------------------------------------------------------------

export const Carousel = ({ images }: { images?: string[] }) => {
  const defaultImages = [
    ...hardcodedDesigners,
    ...hardcodedDevelopers,
  ].map((m) => m.image);

  const src = images && images.length > 0 ? images : defaultImages;
  // Duplicate so the marquee loops seamlessly
  const doubled = [...src, ...src];

  return (
    <div className="w-full overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: "marquee-scroll 28s linear infinite",
        }}
      >
        {doubled.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`member-${idx}`}
            loading="lazy"
            className="w-[220px] h-[220px] object-cover rounded-2xl flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Team member card (same layout as before)
// ---------------------------------------------------------------------------

const TeamMemberCard = ({ member, index }: { member: Member; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: easeInOut }}
    viewport={{ once: true, amount: 0.3 }}
    custom={index}
    className="flex flex-col md:flex-row items-center gap-8 md:gap-20 rounded-xl h-auto"
  >
    <div className="w-full aspect-[4/3] md:aspect-[11/13] md:w-[395px] flex-shrink-0 overflow-hidden rounded-2xl">
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
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

// ---------------------------------------------------------------------------
// TeamSection
// ---------------------------------------------------------------------------

type TeamSectionProps = {
  title: string;
  members: Member[];
};

export const TeamSection = ({ title, members }: TeamSectionProps) => (
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

// ---------------------------------------------------------------------------
// Top section
// ---------------------------------------------------------------------------

const TopSection = ({ images }: { images?: string[] }) => (
  <div className="flex flex-col justify-between items-center md:pt-20 pb-16 px-6 md:px-16 mb-8 relative gap-8">
    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10 pointer-events-none" />
    <div className="flex flex-col gap-1 items-center text-center">
      <h1 className="text-3xl md:text-5xl font-bold text-swamp mb-4">
        Meet the Team <br />
        <span className="text-gray-700">Visionaries</span>
      </h1>
      <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
        This team put together the functionality and design of the Society of
        Electrical and Engineering Students website together.
      </p>
      <a
        href="/contact"
        className="inline-block bg-swamp text-white font-semibold py-3 px-8 rounded-2xl hover:bg-[#02543d] transition-all"
      >
        Contact Us
      </a>
    </div>
    <Carousel images={images} />
  </div>
);

// ---------------------------------------------------------------------------
// Hardcoded fallback data
// ---------------------------------------------------------------------------

const hardcodedDesigners: Member[] = [
  {
    name: "Adewuyi Oyinda",
    role: "UI/UX Designer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers.",
    image: "6789d9097fc06f5b98c29b73ab472ff52652d2f8.png",
    portfolio: "#",
  },
  {
    name: "Chinonso Victor",
    role: "Graphic Designer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers.",
    image: "contentone.jpg",
    portfolio: "#",
  },
];

const hardcodedDevelopers: Member[] = [
  {
    name: "Adewuyi Oyinda",
    role: "Frontend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers.",
    image: "contenttwo.jpg",
    portfolio: "#",
  },
  {
    name: "Chinonso Victor",
    role: "Backend Developer",
    description:
      "Our vision is to be a globally recognized leader in Electrical and Electronics Engineering, pioneering innovation, and cultivating future-ready engineers.",
    image: "hod.png",
    portfolio: "#",
  },
];

// ---------------------------------------------------------------------------
// Teams page — DB-driven with category grouping
// ---------------------------------------------------------------------------

type DBTeamMember = {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  portfolio: string;
  category: string;
  display_order: number;
};

export default function Teams() {
  const [groupedMembers, setGroupedMembers] = useState<
    Record<string, Member[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const groups: Record<string, Member[]> = {};
          (data as DBTeamMember[]).forEach((m) => {
            const cat = m.category || "Team";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({
              name: m.name,
              role: m.role,
              description: m.description ?? "",
              image: m.image_url ?? "contentone.jpg",
              portfolio: m.portfolio || "#",
            });
          });
          setGroupedMembers(groups);
        }
        setLoading(false);
      });
  }, []);

  const hasData = Object.keys(groupedMembers).length > 0;
  const allImages = Object.values(groupedMembers).flat().map((m) => m.image);

  return (
    <main className="bg-gray-50 min-h-screen mt-20 md:mt-0 py-20">
      <TopSection images={hasData ? allImages : undefined} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
        </div>
      ) : hasData ? (
        Object.entries(groupedMembers).map(([category, members]) => (
          <TeamSection key={category} title={category} members={members} />
        ))
      ) : (
        <>
          <TeamSection title="Meet The Designers" members={hardcodedDesigners} />
          <TeamSection title="Meet The Developers" members={hardcodedDevelopers} />
        </>
      )}
    </main>
  );
}