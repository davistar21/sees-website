import { useEffect, useState } from "react";
import { Carousel, TeamSection, type Member, type CarouselMember } from "./Teams";
import { supabase, type Executive } from "../lib/supabase";

const TopSection = ({ members }: { members: Member[] }) => {
  const carouselMembers: CarouselMember[] = members.map((m) => ({
    name: m.name,
    role: m.role,
    image: m.image,
  }));
  return (
    <div className="flex flex-col justify-between items-center md:pt-20 pb-16 px-6 md:px-16 mb-8 relative gap-8">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10 pointer-events-none" />
      <div className="flex flex-col gap-1 items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-swamp mb-4">
          Meet the Executives
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
          The Executives of the Society of Electrical, Electronics, and Computer Engineering Students
        </p>
        <a
          href="mailto:theseesunilagofficial@gmail.com?subject=Inquiry%20from%20SEES%20Website&body=Hello%20SEES%20Team%2C%20I%20hope%20this%20message%20finds%20you%20well.%20My%20name%20is%20%5BYour%20Name%5D%2C%20and%20I%20am%20reaching%20out%20regarding%20%5Byour%20reason%5D.%20Please%20find%20the%20details%20of%20my%20inquiry%20below.%20I%20would%20appreciate%20your%20response%20at%20your%20earliest%20convenience.%20Thank%20you%20for%20your%20time%20and%20consideration.%20Best%20regards%2C%20%5BYour%20Name%5D."
          className="inline-block bg-swamp text-white font-semibold py-3 px-8 rounded-2xl hover:bg-[#02543d] transition-all"
        >
          Contact Us
        </a>
      </div>
      <Carousel members={carouselMembers.length > 0 ? carouselMembers : undefined} />
    </div>
  );
};

const execToMember = (exec: Executive): Member => ({
  name: exec.name,
  role: exec.role,
  description: exec.description ?? "",
  image: exec.image_url ?? "contenttwo.jpg",
  portfolio: exec.portfolio || "#",
  whatsapp_url: exec.whatsapp_url ?? "",
});

const Executives = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("executives")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setMembers((data ?? []).map(execToMember));
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen mt-20 md:mt-0 py-20">
      <TopSection members={members} />
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No executives listed yet.
        </p>
      ) : (
        <TeamSection title="Meet the Executives" members={members} layout="list" />
      )}
    </main>
  );
};

export default Executives;