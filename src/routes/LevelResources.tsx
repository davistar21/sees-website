import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, type Resource } from "../lib/supabase";
import { ArrowLeft, ExternalLink, BookOpen, YoutubeIcon, Play, Book } from "lucide-react";

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

const typeBg: Record<Resource["type"], string> = {
  lesson_notes: "bg-[#e8fff7] text-[#013f31]",
  youtube: "bg-[#fff8e1] text-[#b47e00]",
  tutorial: "bg-[#e8fff7] text-[#013f31]",
  textbook: "bg-[#fff8e1] text-[#b47e00]",
};

const VALID_LEVELS = [100, 200, 300, 400, 500];

// ─── Resource row ─────────────────────────────────────────────

const ResourceRow = ({ resource }: { resource: Resource }) => {
  const Icon = typeIcon[resource.type];
  return (
    <a
      href={resource.url ?? "#"}
      target={resource.url ? "_blank" : undefined}
      rel="noreferrer"
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
        !resource.url ? "opacity-50 pointer-events-none" : ""
      }`}
      style={{ borderColor: "rgba(149,253,226,0.4)" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#95fde2";
        el.style.backgroundColor = "#e8fff7";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(149,253,226,0.4)";
        el.style.backgroundColor = "transparent";
      }}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeBg[resource.type]}`}>
        <Icon size={15} />
      </div>
      <span
        className="flex-1 text-sm font-medium truncate transition-colors group-hover:text-[#013f31]"
        style={{ color: "#0f0f0f" }}
      >
        {resource.title}
      </span>
      {resource.url && (
        <ExternalLink size={14} style={{ color: "#95fde2" }} className="flex-shrink-0 group-hover:text-[#013f31] transition-colors" />
      )}
    </a>
  );
};

// ─── Page ─────────────────────────────────────────────────────

const LevelResources = () => {
  const { level } = useParams<{ level: string }>();
  const levelNum = parseInt(level ?? "0");

  const [resources, setResources] = useState<Resource[]>([]);
  const [activeType, setActiveType] = useState<Resource["type"] | "all">("all");
  const [loading, setLoading] = useState(true);

  const isValid = VALID_LEVELS.includes(levelNum);

  useEffect(() => {
    if (!isValid) return;
    supabase
      .from("resources")
      .select("*")
      .eq("level", levelNum)
      .order("type")
      .then(({ data }) => {
        setResources(data ?? []);
        setLoading(false);
      });
  }, [levelNum, isValid]);

  if (!isValid) {
    return (
      <div className="min-h-screen mt-20 flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-3xl font-bold" style={{ color: "#0f0f0f" }}>Invalid level</h1>
        <Link
          to="/resources"
          className="px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#013f31", color: "#ffffff" }}
        >
          Back to Resources
        </Link>
      </div>
    );
  }

  const displayed = activeType === "all" ? resources : resources.filter((r) => r.type === activeType);
  const countOf = (type: Resource["type"]) => resources.filter((r) => r.type === type).length;

  return (
    <div className="min-h-screen mt-20 pb-20" style={{ backgroundColor: "#ffffff" }}>

      {/* ── Header ── */}
      <div className="py-16 px-6 text-center" style={{ backgroundColor: "#013f31" }}>
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-2"
          style={{ color: "rgba(149,253,226,0.65)" }}
        >
          Level Resources
        </p>
        <h1 className="text-5xl md:text-7xl font-bold" style={{ color: "#95fde2" }}>
          {levelNum}
        </h1>
        <p className="mt-2 text-lg" style={{ color: "rgba(149,253,226,0.65)" }}>
          {resources.length > 0
            ? `${resources.length} resource${resources.length !== 1 ? "s" : ""} available`
            : "Resources coming soon"}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mt-8 mb-6 text-sm">
          <Link
            to="/resources"
            className="flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#013f31" }}
          >
            <ArrowLeft size={15} /> Resources
          </Link>
          <span style={{ color: "#e0e0e0" }}>/</span>
          <span style={{ color: "#787878" }}>{levelNum} Level</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: "#013f31", borderTopColor: "transparent" }}
            />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#787878" }}>
            <p className="text-lg font-medium">No resources yet for {levelNum} Level</p>
            <p className="text-sm mt-2">Check back soon — the admin team is working on it.</p>
            <Link
              to="/resources"
              className="inline-block mt-6 px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "#013f31", color: "#ffffff" }}
            >
              Browse General Resources
            </Link>
          </div>
        ) : (
          <>
            {/* ── Type filter tabs ── */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveType("all")}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                style={{
                  backgroundColor: activeType === "all" ? "#013f31" : "#e8fff7",
                  color: activeType === "all" ? "#95fde2" : "#013f31",
                  borderColor: activeType === "all" ? "#013f31" : "#95fde2",
                }}
              >
                All ({resources.length})
              </button>

              {TYPES.filter((t) => countOf(t) > 0).map((type) => {
                const Icon = typeIcon[type];
                const isActive = activeType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: isActive ? "#013f31" : "#e8fff7",
                      color: isActive ? "#95fde2" : "#013f31",
                      borderColor: isActive ? "#013f31" : "#95fde2",
                    }}
                  >
                    <Icon size={14} />
                    {typeLabel[type]} ({countOf(type)})
                  </button>
                );
              })}
            </div>

            {/* ── Resources ── */}
            {activeType === "all" ? (
              <div className="space-y-8">
                {TYPES.filter((t) => countOf(t) > 0).map((type) => {
                  const Icon = typeIcon[type];
                  const items = resources.filter((r) => r.type === type);
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#013f31" }}
                        >
                          <Icon size={14} style={{ color: "#95fde2" }} />
                        </div>
                        <h3 className="font-semibold" style={{ color: "#0f0f0f" }}>
                          {typeLabel[type]}
                        </h3>
                        <span className="text-xs ml-1" style={{ color: "#787878" }}>
                          {items.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((r) => (
                          <ResourceRow key={r.id} resource={r} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayed.map((r) => (
                  <ResourceRow key={r.id} resource={r} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Other levels ── */}
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid #e0e0e0" }}>
          <p className="text-sm font-medium mb-4" style={{ color: "#787878" }}>
            Other levels
          </p>
          <div className="flex flex-wrap gap-3">
            {VALID_LEVELS.filter((l) => l !== levelNum).map((l) => (
              <Link
                key={l}
                to={`/resources/${l}`}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:shadow-md"
                style={{ backgroundColor: "#e8fff7", color: "#013f31", borderColor: "#95fde2" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#013f31";
                  (e.currentTarget as HTMLElement).style.color = "#95fde2";
                  (e.currentTarget as HTMLElement).style.borderColor = "#013f31";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#e8fff7";
                  (e.currentTarget as HTMLElement).style.color = "#013f31";
                  (e.currentTarget as HTMLElement).style.borderColor = "#95fde2";
                }}
              >
                {l} Level
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelResources;