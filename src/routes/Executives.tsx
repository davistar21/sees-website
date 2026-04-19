import { useEffect, useState } from "react";
import { Carousel, TeamSection, type Member } from "./Teams";
import { supabase, type Executive } from "../lib/supabase";

const TopSection = ({ members }: { members: Member[] }) => {
  return (
    <div className="flex flex-col justify-between items-center md:pt-20 pb-40 px-6 md:px-16 mb-8 relative gap-8">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent to-white/30 z-10"></div>
      <div className="flex flex-col gap-1 items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-swamp mb-4">
          Meet the Executives
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
      <Carousel images={members.map((m) => m.image).filter(Boolean)} />
    </div>
  );
};

const execToMember = (exec: Executive): Member => ({
  name: exec.name,
  role: exec.role,
  description: exec.description ?? "",
  image: exec.image_url ?? "contenttwo.jpg",
  portfolio: exec.portfolio || "#",
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
        <TeamSection title="Meet the Executives" members={members} />
      )}
    </main>
  );
};

export default Executives;
