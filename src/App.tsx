import { useEffect, useState } from "react";
import "./App.css";
import "./styles/homepage.css";
import Vision from "./components/Vision";
import About from "./components/About";
import Resources from "./routes/Resources";
import ContentCard from "./components/ContentCard";
import Hod from "./components/Hod";
import Newsletter from "./components/Newsletter";
import { supabase, type HeroSlide, type Announcement, type SpotlightPerson } from "./lib/supabase";
import { Link } from "react-router-dom";
import { ArrowRight, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Announcement banner
// ---------------------------------------------------------------------------
const AnnouncementBanner = ({ items }: { items: Announcement[] }) => {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  const current = items[idx];

  return (
    // top-[87px] on all screens — matches header height (87×87 logo)
    <div className="fixed top-[87px] left-0 right-0 z-40 bg-swamp text-white shadow-md">
      <div className="flex items-start gap-2 px-3 py-2.5">
        {items.length > 1 && (
          <button
            onClick={() => setIdx((i) => (i === 0 ? items.length - 1 : i - 1))}
            className="shrink-0 hover:opacity-70 transition-opacity p-0.5 mt-0.5"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <p className="flex-1 text-center text-sm min-w-0">
          <span className="font-semibold">{current.title}</span>
          {current.content && (
            <span className="text-white/80 ml-1.5">— {current.content}</span>
          )}
        </p>

        {items.length > 1 && (
          <button
            onClick={() => setIdx((i) => (i === items.length - 1 ? 0 : i + 1))}
            className="shrink-0 hover:opacity-70 transition-opacity p-0.5 mt-0.5"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        )}
        {items.length > 1 && (
          <span className="text-white/50 text-xs shrink-0 mt-0.5">{idx + 1}/{items.length}</span>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 hover:opacity-70 transition-opacity ml-1 p-0.5 mt-0.5"
          aria-label="Dismiss announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Spotlight modal
// ---------------------------------------------------------------------------
const SpotlightModal = ({ person, onClose }: { person: SpotlightPerson; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {person.image_url && (
          <div className="w-full h-48 relative overflow-hidden">
            <img
              src={person.image_url}
              alt={person.name}
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-sm text-white/80">{person.role}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-5 space-y-3">
          {!person.image_url && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                <p className="text-sm text-swamp font-medium">{person.role}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          <span className="inline-block bg-[#36CE8A26] text-swamp text-xs font-semibold px-3 py-1 rounded-full">
            {person.category}
          </span>

          {person.quote && (
            <blockquote className="border-l-4 border-swamp pl-4 italic text-gray-600 text-sm">
              "{person.quote}"
            </blockquote>
          )}

          {person.bio && (
            <p className="text-gray-700 text-sm leading-relaxed">{person.bio}</p>
          )}

          {(person.linkedin_url || person.instagram_url) && (
            <div className="flex gap-3 pt-1">
              {person.linkedin_url && (
                <a
                  href={person.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-swamp font-medium hover:opacity-70 transition-opacity"
                >
                  <ExternalLink size={14} /> LinkedIn
                </a>
              )}
              {person.instagram_url && (
                <a
                  href={person.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-swamp font-medium hover:opacity-70 transition-opacity"
                >
                  <ExternalLink size={14} /> Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Spotlight section
// ---------------------------------------------------------------------------
const SpotlightSection = () => {
  const [people, setPeople] = useState<SpotlightPerson[]>([]);
  const [selected, setSelected] = useState<SpotlightPerson | null>(null);

  useEffect(() => {
    supabase
      .from("spotlight")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPeople(data);
      });
  }, []);

  if (people.length === 0) return null;

  const doubled = [...people, ...people];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-swamp">Alumni &amp; Student Spotlight</h2>
        <p className="text-gray-500 mt-2 text-base max-w-xl mx-auto">
          Celebrating the achievements and stories of our outstanding members
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="marquee-track flex gap-5"
          style={{ width: "max-content", animation: "marquee-scroll 25s linear infinite" }}
        >
          {doubled.map((person, i) => (
            <button
              key={i}
              onClick={() => setSelected(person)}
              className="w-[240px] flex-shrink-0 text-left group focus:outline-none"
            >
              <div className="relative w-full h-[300px] rounded-2xl overflow-hidden">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#013f31]/10 flex items-center justify-center">
                    <span className="text-4xl text-swamp font-bold">{person.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-base leading-tight">{person.name}</p>
                  <p className="text-xs text-white/80 mt-0.5">{person.role}</p>
                  {person.quote && (
                    <p className="text-xs text-white/70 mt-1.5 line-clamp-2 italic">"{person.quote}"</p>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    {person.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <SpotlightModal person={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------
type BlogPreview = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
};

const getReadTime = (content: string | null) =>
  Math.max(1, Math.round((content ?? "").split(" ").length / 200));

const getExcerpt = (content: string | null) => {
  if (!content) return "";
  return content.slice(0, 100) + (content.length > 100 ? "..." : "");
};

type TimeLeft = { days: number; hours: number; mins: number };

const calcTimeLeft = (target: string): TimeLeft => {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
  };
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const App = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<HeroSlide | null>(null);
  const [posts, setPosts] = useState<BlogPreview[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [countdownTarget, setCountdownTarget] = useState<string | null>(null);
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    supabase
      .from("hero_slides")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setSlides(data);
      });

    supabase
      .from("blog_posts")
      .select("id, title, content, image_url")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setPosts(data);
      });

    supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setAnnouncements(data);
      });

    supabase
      .from("events")
      .select("title, event_date, event_time")
      .eq("is_featured", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data && data[0]?.event_date) {
          const time = data[0].event_time ?? "00:00";
          setCountdownTarget(`${data[0].event_date}T${time}`);
          setCountdownLabel(data[0].title ?? null);
        }
      });
  }, []);

  // Slide rotation
  useEffect(() => {
    if (slides.length === 0) return;
    let idx = 0;
    setCurrentSlide(slides[0]);
    const interval = setInterval(() => {
      idx = idx === slides.length - 1 ? 0 : idx + 1;
      setCurrentSlide(slides[idx]);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // Countdown timer
  useEffect(() => {
    if (!countdownTarget) return;
    setTimeLeft(calcTimeLeft(countdownTarget));
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(countdownTarget)), 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  return (
    <div className="all-contents">
      <AnnouncementBanner items={announcements} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="main"
        style={{ backgroundImage: currentSlide ? `url(${currentSlide.image_url})` : undefined }}
      >
        <div className="overlay" />

        {/* Content — absolutely fills the hero, centers text like Events page */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-5 md:gap-8" style={{ zIndex: 2 }}>
          {currentSlide ? (
            <>
              <h1 className="text-3xl sm:text-5xl md:text-[64px] font-bold text-white leading-tight max-w-4xl">
                {currentSlide.title}
              </h1>
              {currentSlide.subtitle && (
                <p className="text-base sm:text-lg md:text-[24px] font-semibold text-white/90 max-w-3xl">
                  {currentSlide.subtitle}
                </p>
              )}
            </>
          ) : (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {/* Countdown */}
          {countdownLabel && (
            <p className="text-white/70 text-xs sm:text-sm font-medium tracking-widest uppercase -mb-3">
              Counting down to — {countdownLabel}
            </p>
          )}
          <div className="countdown">
            <div className="time-box">
              <div className="number">{String(timeLeft.days).padStart(2, "0")}</div>
              <div className="label">Days</div>
            </div>
            <span className="colon">:</span>
            <div className="time-box">
              <div className="number">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="label">Hours</div>
            </div>
            <span className="colon">:</span>
            <div className="time-box">
              <div className="number">{String(timeLeft.mins).padStart(2, "0")}</div>
              <div className="label">Mins</div>
            </div>
          </div>
        </div>
      </div>

      <Vision />
      <About />

      {/* ── Blog posts — only shown when posts exist ─────────────────────── */}
      {posts.length > 0 && (
        <div className="w-full bg-white py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
              {posts.map((post, i) => (
                <ContentCard
                  key={post.id || i}
                  id={post.id}
                  img={post.image_url ?? "/contentone.jpg"}
                  title={post.title}
                  excerpt={getExcerpt(post.content)}
                  readTime={getReadTime(post.content)}
                />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                to="/blog"
                className="flex items-center gap-2 py-3 px-8 rounded-2xl font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#013f31", color: "#95fde2" }}
              >
                View all posts <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Resources />
      <SpotlightSection />
      <Hod />
      <Newsletter />
    </div>
  );
};

export default App;