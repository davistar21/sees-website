import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Clock, ArrowUpRight } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author: string | null;
  created_at: string;
};

type SortOption = "newest" | "oldest" | "az" | "za";

const getReadTime = (content: string | null) =>
  Math.max(1, Math.round((content ?? "").split(" ").length / 200));

const getExcerpt = (content: string | null) => {
  if (!content) return "";
  return content.slice(0, 140) + (content.length > 140 ? "..." : "");
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, content, image_url, author, created_at")
      .eq("published", true)
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...posts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.content ?? "").toLowerCase().includes(q) ||
          (p.author ?? "").toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      return 0;
    });

    setFiltered(result);
  }, [posts, sort, search]);

  return (
    <div className="min-h-screen mt-20 pb-16">
      {/* Header */}
      <div className="bg-swamp text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Stories, updates and insights from the SEES community
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-swamp/30 focus:border-swamp"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-swamp/30 focus:border-swamp"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-lg">
            {search ? "No posts match your search." : "No posts published yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image_url ?? "/contentone.jpg"}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>{post.author ?? "SEES Team"}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {getReadTime(post.content)} min read
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-swamp transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
                    {getExcerpt(post.content)}
                  </p>
                  <div className="flex items-center gap-1 text-swamp font-semibold text-sm mt-4">
                    Read more <ArrowUpRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;