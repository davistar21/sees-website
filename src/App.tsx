import { useRef, useEffect, useState } from "react";
import "./App.css";
import "./styles/homepage.css";
import Vision from "./components/Vision";
import About from "./components/About";
import Resources from "./routes/Resources";
import ContentCard from "./components/ContentCard";
import Hod from "./components/Hod";
import Newsletter from "./components/Newsletter";
import { supabase, type HeroSlide, type Announcement } from "./lib/supabase";
import { Link } from "react-router-dom";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Announcement banner
// ---------------------------------------------------------------------------
const AnnouncementBanner = ({ items }: { items: Announcement[] }) => {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  const current = items[idx];

  return (
    <div className="fixed top-[70px] md:top-[87px] left-0 right-0 z-40 bg-swamp text-white px-4 py-2 flex items-center gap-3 shadow-md">
      {items.length > 1 && (
        <button
          onClick={() => setIdx((i) => (i === 0 ? items.length - 1 : i - 1))}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <p className="flex-1 text-center text-sm min-w-0 truncate">
        <span className="font-semibold">{current.title}</span>
        {current.content && (
          <span className="text-white/80 ml-2 hidden sm:inline">{current.content}</span>
        )}
      </p>

      {items.length > 1 && (
        <button
          onClick={() => setIdx((i) => (i === items.length - 1 ? 0 : i + 1))}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <ChevronRight size={16} />
        </button>
      )}
      {items.length > 1 && (
        <span className="text-white/50 text-xs shrink-0">{idx + 1}/{items.length}</span>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 hover:opacity-70 transition-opacity ml-1"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
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

const fallbackSlides: HeroSlide[] = [
  {
    id: "1",
    image_url: "/bg-one.jpg",
    title: "SEES HOD GAMES 2026",
    subtitle: "Theme: Legacy of Excellence",
    display_order: 0,
    active: true,
    created_at: "",
  },
  {
    id: "2",
    image_url: "/bg-two.JPG",
    title: "Student Debate Competition",
    subtitle: "Theme: Learning Reimagined: AI and the the Future of Education",
    display_order: 1,
    active: true,
    created_at: "",
  },
  {
    id: "3",
    image_url: "/bg-three.jpg",
    title: "Student Food Drive",
    subtitle: "heme: Learning Reimagined: AI and the the Future of Education",
    display_order: 2,
    active: true,
    created_at: "",
  },
];

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
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [posts, setPosts] = useState<BlogPreview[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [countdownTarget, setCountdownTarget] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0 });

  const mainRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const sideContentRef = useRef<HTMLDivElement | null>(null);
  const currentIndex = useRef(0);

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
      .select("event_date, event_time")
      .eq("is_featured", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data && data[0]?.event_date) {
          const time = data[0].event_time ?? "00:00";
          setCountdownTarget(`${data[0].event_date}T${time}`);
        }
      });
  }, []);

  useEffect(() => {
    if (!countdownTarget) return;
    setTimeLeft(calcTimeLeft(countdownTarget));
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(countdownTarget)), 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  useEffect(() => {
    if (slides.length === 0) return;
    currentIndex.current = 0;

    const transition = () => {
      const slide = slides[currentIndex.current];
      if (mainRef.current) {
        mainRef.current.style.backgroundImage = `url(${slide.image_url})`;
      }
      if (mainContentRef.current) {
        mainContentRef.current.innerHTML = slide.title;
      }
      if (sideContentRef.current) {
        sideContentRef.current.innerHTML = slide.subtitle ?? "";
      }
      currentIndex.current =
        currentIndex.current === slides.length - 1
          ? 0
          : currentIndex.current + 1;
    };

    transition();
    const interval = setInterval(transition, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const fallbackPosts: BlogPreview[] = [
    { id: "", title: "The Fall", content: "It was the sign out of 2025 when Sunmisola Ganikale saw a bright light in the distance and knew things would never be the same again for the students.", image_url: "/contenttwo.jpg" },
    { id: "", title: "Rising Up", content: "The engineering students gathered at dawn, ready to face the challenges that lay ahead in the new academic session with determination.", image_url: "/contentone.jpg" },
    { id: "", title: "The Future", content: "Technology and innovation drive the new generation of electrical engineers who are determined to solve Africa's most pressing challenges.", image_url: "/contenttwo.jpg" },
  ];

  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <div className="all-contents">
      <AnnouncementBanner items={announcements} />

      <div className="main pt-[70px] md:pt-[87px]" ref={mainRef}>
        <div className="overlay"></div>

        <div className="rest">
          <div className="welcome-texts">
            <div className="main-content" ref={mainContentRef} />
            <div className="side-text" ref={sideContentRef} />

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
      </div>

      <Vision />
      <About />

      <div className="w-full bg-white py-12 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {displayPosts.map((post, i) => (
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

      <Resources />
      <Hod />
      <Newsletter />
    </div>
  );
};

export default App;