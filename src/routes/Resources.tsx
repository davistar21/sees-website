import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase, type Resource } from "../lib/supabase";
import { ExternalLink, ChevronRight, BookOpen, YoutubeIcon, Play, Book } from "lucide-react";

// ─── Brand palette ────────────────────────────────────────────
// #013f31 deep forest green  |  #95fde2 mint green
// #e8fff7 off-white mint     |  #ffb703 amber
// #ffffff white              |  #0f0f0f near black

const TYPES: Resource["type"][] = ["lesson_notes", "youtube", "tutorial", "textbook"];

const typeLabel: Record<Resource["type"], string> = {
  lesson_notes: "Lesson Notes",
  youtube: "YouTube Links",
  tutorial: "Tutorial Videos",
  textbook: "Textbooks",
};

const typeIcon: Record<Resource["type"], React.ElementType> = {
  lesson_notes: BookOpen,
  youtube: YoutubeIcon,
  tutorial: Play,
  textbook: Book,
};

// Inactive chip: mint tint bg + swamp text
const typeBg: Record<Resource["type"], string> = {
  lesson_notes: "bg-[#e8fff7] text-[#013f31]",
  youtube:      "bg-[#fff8e1] text-[#b47e00]",
  tutorial:     "bg-[#e8fff7] text-[#013f31]",
  textbook:     "bg-[#fff8e1] text-[#b47e00]",
};

const LEVELS = [100, 200, 300, 400, 500];

// ─── Resource item ────────────────────────────────────────────

const ResourceItem = ({ resource }: { resource: Resource }) => {
  const Icon = typeIcon[resource.type];
  return (
    <a
      href={resource.url ?? "#"}
      target={resource.url ? "_blank" : undefined}
      rel="noreferrer"
      className={`flex items-center gap-3 p-3 rounded-xl border border-[#95fde2]/40 hover:border-[#95fde2] hover:bg-[#e8fff7] transition-all group ${
        !resource.url ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeBg[resource.type]}`}>
        <Icon size={15} />
      </div>
      <span className="flex-1 text-sm font-medium text-[#0f0f0f] group-hover:text-[#013f31] transition-colors truncate">
        {resource.title}
      </span>
      {resource.url && (
        <ExternalLink size={14} className="text-[#95fde2] group-hover:text-[#013f31] flex-shrink-0" />
      )}
    </a>
  );
};

// ─── Main page ────────────────────────────────────────────────

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = (searchParams.get("type") as Resource["type"]) ?? "lesson_notes";

  const [generalResources, setGeneralResources] = useState<Resource[]>([]);
  const [levelCounts, setLevelCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .is("level", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => setGeneralResources(data ?? []));

    Promise.all(
      LEVELS.map((lvl) =>
        supabase
          .from("resources")
          .select("id", { count: "exact", head: true })
          .eq("level", lvl)
          .then(({ count }) => ({ lvl, count: count ?? 0 }))
      )
    ).then((results) => {
      const counts: Record<number, number> = {};
      results.forEach(({ lvl, count }) => (counts[lvl] = count));
      setLevelCounts(counts);
      setLoading(false);
    });
  }, []);

  const filtered = generalResources.filter((r) => r.type === activeType);

  return (
    <div className="min-h-screen mt-20 pb-20" style={{ backgroundColor: "#ffffff" }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#013f31" }} className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{ color: "#95fde2" }}>
          Our Resources
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(149,253,226,0.65)" }}>
          Curated learning materials for every level of your journey
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* ── General Resources ── */}
        <section className="mt-14">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#0f0f0f" }}>
              General Resources
            </h2>
            <p className="mt-1" style={{ color: "#787878" }}>
              Available to all levels — pick a category to browse
            </p>
          </div>

          {/* Type filter cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {TYPES.map((type) => {
              const Icon = typeIcon[type];
              const count = generalResources.filter((r) => r.type === type).length;
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSearchParams({ type })}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center"
                  style={{
                    backgroundColor: isActive ? "#013f31" : "#e8fff7",
                    borderColor: isActive ? "#013f31" : "#95fde2",
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: isActive ? "#95fde2" : "#013f31" }}
                  >
                    <Icon size={22} style={{ color: isActive ? "#013f31" : "#95fde2" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: isActive ? "#ffffff" : "#013f31" }}
                    >
                      {typeLabel[type]}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: isActive ? "rgba(149,253,226,0.75)" : "#787878" }}
                    >
                      {count} item{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Resource list */}
          <div
            className="rounded-2xl p-6 min-h-[200px] border"
            style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#013f31" }}
              >
                {(() => {
                  const Icon = typeIcon[activeType];
                  return <Icon size={14} style={{ color: "#95fde2" }} />;
                })()}
              </div>
              <h3 className="font-semibold" style={{ color: "#0f0f0f" }}>
                {typeLabel[activeType]}
              </h3>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin"
                  style={{ borderColor: "#013f31", borderTopColor: "transparent" }}
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10" style={{ color: "#787878" }}>
                <p className="text-sm">No {typeLabel[activeType].toLowerCase()} added yet.</p>
                <p className="text-xs mt-1">Admins can add them via the dashboard.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((r) => (
                  <ResourceItem key={r.id} resource={r} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Browse by Level ── */}
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#0f0f0f" }}>
              Browse by Level
            </h2>
            <p className="mt-1" style={{ color: "#787878" }}>
              Resources tailored specifically for each academic level
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {LEVELS.map((level) => {
              const count = levelCounts[level] ?? 0;
              return (
                <Link
                  key={level}
                  to={`/resources/${level}`}
                  className="group flex flex-col justify-between p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#013f31] hover:border-[#013f31]"
                  style={{ backgroundColor: "#e8fff7", borderColor: "#95fde2" }}
                >
                  <div>
                    <p className="text-3xl font-bold transition-colors duration-200 text-[#013f31] group-hover:text-[#95fde2]">
                      {level}
                    </p>
                    <p className="text-sm font-medium mt-0.5 transition-colors duration-200 text-[#013f31] group-hover:text-[#95fde2]/80">
                      Level
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-xs font-medium transition-colors duration-200 text-[#013f31] group-hover:text-[#95fde2]/70">
                      {count} resource{count !== 1 ? "s" : ""}
                    </span>
                    <ChevronRight
                      size={18}
                      className="transition-all duration-200 group-hover:translate-x-0.5 text-[#013f31] group-hover:text-[#95fde2]"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;