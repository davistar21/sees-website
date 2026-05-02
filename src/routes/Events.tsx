import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase, type DBEvent, type GalleryImage, type FeaturedVideo } from "../lib/supabase";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const formatDate = (date: string | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isPast = (date: string | null): boolean => {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
};

// ---------------------------------------------------------------------------
// Gallery Lightbox
// ---------------------------------------------------------------------------

interface LightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [idx, setIdx] = useState(initialIndex);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {idx + 1} / {images.length}
      </p>

      {/* Image */}
      <div
        className="relative max-w-4xl w-full max-h-[75vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[idx].url}
          alt={images[idx].description}
          loading="lazy"
          className="max-h-[70vh] max-w-full object-contain rounded-xl"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {images[idx].description && (
        <p className="mt-4 text-white/80 text-sm text-center max-w-xl">
          {images[idx].description}
        </p>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt=""
              loading="lazy"
              onClick={() => setIdx(i)}
              className={`w-12 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                i === idx ? "border-[#95fde2]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: DBEvent;
  onViewHighlights: (event: DBEvent) => void;
}

const EventCard = ({ event, onViewHighlights }: EventCardProps) => {
  const gallery = event.gallery_images ?? [];
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center">
      {/* Main image card */}
      <div className="shadow-sm w-full md:w-[515px] min-h-[300px] md:h-[411px] relative overflow-hidden rounded-[20px] bg-black/40 flex flex-col px-4 py-2 flex-shrink-0">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent -z-5" />
        <div className="p-4 text-white flex flex-col mt-auto items-start">
          <h3 className="text-xl md:text-[24px] font-semibold">{event.title}</h3>
          <div className="text-sm mt-2 flex gap-6 items-center flex-wrap">
            {event.location && (
              <p className="flex gap-1 items-center">
                <MapPin size={14} /> {event.location}
              </p>
            )}
            {event.event_time && (
              <p className="flex gap-1 items-center">
                <Clock size={14} /> {event.event_time}
              </p>
            )}
            {event.event_date && (
              <p className="flex gap-1 items-center">
                <CalendarDays size={14} /> {formatDate(event.event_date)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gallery strip */}
      <div className="flex flex-col-reverse justify-between flex-wrap gap-4">
        {gallery.length > 0 && (
          <button
            onClick={() => onViewHighlights(event)}
            className="text-sm text-swamp font-medium cursor-pointer ml-auto md:ml-0 flex gap-[2px] items-center hover:text-swamp/60 transition-colors"
          >
            View full highlights <ArrowUpRight size={16} />
          </button>
        )}
        <div className="flex flex-wrap gap-2">
          {gallery.map((img, h) => (
            <img
              key={h}
              src={img.url}
              alt={img.description || `Gallery ${h + 1}`}
              loading="lazy"
              className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewHighlights(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const EventTabs = ({ tabs, activeTab, onTabClick }: EventTabsProps) => (
  <div className="flex flex-wrap gap-2 bg-[#E0E0E087] p-2 md:px-6 md:py-4 w-full md:w-fit mx-auto my-12 rounded-xl">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabClick(tab)}
        className={`px-3 md:px-6 py-2 font-medium transition-colors text-sm md:text-lg ${
          tab === activeTab ? "bg-swamp rounded-xl text-white" : "text-gray-600"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const TABS = ["Corporate events", "Sport events", "Fun events", "Past events"];

const Events = () => {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Corporate events");
  const [lightboxEvent, setLightboxEvent] = useState<DBEvent | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })
      .then(({ data }) => {
        setEvents(data ?? []);
        setLoading(false);
      });

    supabase
      .from("featured_video")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setFeaturedVideo(data);
      });
  }, []);

  // Events with images sorted: upcoming first, then most-recent past
  const heroEvents = (() => {
    const now = new Date();
    return events
      .filter((e) => e.image_url)
      .sort((a, b) => {
        const aDate = a.event_date ? new Date(a.event_date) : null;
        const bDate = b.event_date ? new Date(b.event_date) : null;
        const aFuture = aDate && aDate >= now;
        const bFuture = bDate && bDate >= now;
        if (aFuture && bFuture) return aDate!.getTime() - bDate!.getTime();
        if (!aFuture && !bFuture) return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
        return aFuture ? -1 : 1;
      });
  })();
  const safeHeroIndex = heroEvents.length > 0 ? heroIndex % heroEvents.length : 0;
  const currentHeroEvent = heroEvents[safeHeroIndex] ?? null;

  // Tab-filtered events: "Past events" shows all events with date before today
  const filteredEvents =
    activeTab === "Past events"
      ? events.filter((e: DBEvent) => isPast(e.event_date))
      : events.filter((e: DBEvent) => e.category === activeTab);

  // Auto-advance hero once events have loaded
  useEffect(() => {
    if (heroEvents.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroEvents.length]);

  const openLightbox = (event: DBEvent, index = 0) => {
    setLightboxEvent(event);
    setLightboxIndex(index);
  };

  const videoId = featuredVideo ? extractYouTubeId(featuredVideo.youtube_url) : null;

  return (
    <div className="mx-auto w-full pb-8">
      {/* Hero */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background images — crossfade with current event */}
        {heroEvents.map((ev, i) => (
          <img
            key={ev.id}
            src={ev.image_url!}
            alt={ev.title}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === safeHeroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {heroEvents.length === 0 && <div className="absolute inset-0 bg-swamp" />}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 gap-4">
          {currentHeroEvent?.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              {currentHeroEvent.category}
            </span>
          )}

          <h1 className="text-5xl md:text-[64px] font-semibold text-white">
            {currentHeroEvent ? currentHeroEvent.title : "All Events"}
          </h1>

          <span className="text-lg md:text-[24px] font-semibold text-white/90">
            View catchy and exciting stories from past and upcoming events
          </span>

          {currentHeroEvent && (currentHeroEvent.location || currentHeroEvent.event_date) && (
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
            </div>
          )}

          {heroEvents.length > 1 && (
            <div className="flex gap-2 mt-1">
              {heroEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === safeHeroIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

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

      {/* Featured video section */}
      {featuredVideo && (
        <div className="lg:w-[80%] md:w-[90%] w-[95%] my-16 mx-auto">
          {/* Video — rounded top only; description box provides bottom rounding */}
          <div className="relative w-full rounded-t-2xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
            {videoId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="fill-current text-white" size={56} />
                </div>
              </div>
            )}
          </div>
          {/* Description — flush against video, rounded bottom */}
          <div className="bg-[#013f31] rounded-b-2xl px-6 py-4 text-white">
            <h2 className="text-xl md:text-2xl font-semibold">{featuredVideo.title}</h2>
            {featuredVideo.description && (
              <p className="text-white/70 text-sm mt-1">{featuredVideo.description}</p>
            )}
            <div className="flex gap-4 md:gap-6 flex-wrap text-[#95fde2] text-sm mt-2">
              {featuredVideo.location && (
                <span className="flex gap-1 items-center">
                  <MapPin size={14} /> {featuredVideo.location}
                </span>
              )}
              {featuredVideo.event_time && (
                <span className="flex gap-1 items-center">
                  <Clock size={14} /> {featuredVideo.event_time}
                </span>
              )}
              {featuredVideo.event_date && (
                <span className="flex gap-1 items-center">
                  <CalendarDays size={14} /> {formatDate(featuredVideo.event_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <EventTabs tabs={TABS} activeTab={activeTab} onTabClick={setActiveTab} />

      {/* Event cards */}
      <div className="flex flex-col gap-12 max-w-7xl px-4 md:px-8 mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No events in this category yet.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewHighlights={(e) => openLightbox(e, 0)}
            />
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxEvent && (lightboxEvent.gallery_images ?? []).length > 0 && (
        <Lightbox
          images={lightboxEvent.gallery_images!}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;