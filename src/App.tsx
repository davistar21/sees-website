import { useEffect, useState } from "react";
import "./App.css";
import "./styles/homepage.css";
import Vision from "./components/Vision";
import About from "./components/About";
import Resources from "./routes/Resources";
import ContentCard from "./components/ContentCard";
import Hod from "./components/Hod";
import Newsletter from "./components/Newsletter";
import { supabase, type DBEvent, type Announcement, type SpotlightPerson } from "./lib/supabase";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Announcement banner
// ---------------------------------------------------------------------------
const AnnouncementBanner = ({ items }: { items: Announcement[] }) => {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  const current = items[idx];

  return (
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

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const isUpcomingEvent = (ev: DBEvent): boolean => {
  if (!ev.event_date) return false;
  return new Date(`${ev.event_date}T${ev.event_time ?? "00:00"}`) > new Date();
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const App = () => {
  const [heroEvents, setHeroEvents] = useState<DBEvent[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0 });
  const [posts, setPosts] = useState<BlogPreview[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const currentHeroEvent = heroEvents[heroIndex] ?? null;
  const countdownTarget =
    currentHeroEvent && isUpcomingEvent(currentHeroEvent)
      ? `${currentHeroEvent.event_date}T${currentHeroEvent.event_time ?? "00:00"}`
      : null;

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .not("image_url", "is", null)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setHeroEvents(data as DBEvent[]);
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
  }, []);

  // Auto-advance hero — resets when events load
  useEffect(() => {
    if (heroEvents.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroEvents.length]);

  // Countdown — reruns whenever the current event changes
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
      <div className="relative h-screen overflow-hidden">
        {/* Background images — crossfade between events */}
        {heroEvents.map((ev, i) => (
          <img
            key={ev.id}
            src={ev.image_url!}
            alt={ev.title}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {heroEvents.length === 0 && <div className="absolute inset-0 bg-swamp" />}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-4 md:gap-5 z-10">
          {!currentHeroEvent ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {currentHeroEvent.category && (
                <span className="text-xs font-semibold uppercase tracking-widest text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  {currentHeroEvent.category}
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl md:text-[64px] font-bold text-white leading-tight max-w-4xl">
                {currentHeroEvent.title}
              </h1>

              {currentHeroEvent.description && (
                <p className="text-base sm:text-lg text-white/80 max-w-2xl line-clamp-2">
                  {currentHeroEvent.description}
                </p>
              )}

              {(currentHeroEvent.location || currentHeroEvent.event_date || currentHeroEvent.event_time) && (
                <div className="flex flex-wrap gap-2 justify-center text-sm text-white/90">
                  {currentHeroEvent.location && (
                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <MapPin size={13} /> {currentHeroEvent.location}
                    </span>
                  )}
                  {currentHeroEvent.event_date && (
                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <CalendarDays size={13} /> {formatDate(currentHeroEvent.event_date)}
                    </span>
                  )}
                  {currentHeroEvent.event_time && (
                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Clock size={13} /> {currentHeroEvent.event_time}
                    </span>
                  )}
                </div>
              )}

              {isUpcomingEvent(currentHeroEvent) && (
                <>
                  <p className="text-white/60 text-xs font-medium tracking-widest uppercase -mb-1">
                    Counting down
                  </p>
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
                </>
              )}

              {heroEvents.length > 1 && (
                <div className="flex gap-2 mt-1">
                  {heroEvents.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === heroIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Prev / Next arrows */}
        {heroEvents.length > 1 && (
          <>
            <button
              onClick={() => setHeroIndex((i) => (i === 0 ? heroEvents.length - 1 : i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
              aria-label="Previous event"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setHeroIndex((i) => (i === heroEvents.length - 1 ? 0 : i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
              aria-label="Next event"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
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
