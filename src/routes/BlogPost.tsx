import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Clock, ArrowLeft, User } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author: string | null;
  created_at: string;
};

const getReadTime = (content: string | null) =>
  Math.max(1, Math.round((content ?? "").split(" ").length / 200));

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data);
          // Fetch 3 other published posts for "related" section
          supabase
            .from("blog_posts")
            .select("id, title, content, image_url, author, created_at")
            .eq("published", true)
            .neq("id", id)
            .order("created_at", { ascending: false })
            .limit(3)
            .then(({ data: related }) => setRelated(related ?? []));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen mt-20 flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-3xl font-bold text-gray-900">Post not found</h1>
        <p className="text-gray-500">This post may have been removed or doesn't exist.</p>
        <Link to="/blog" className="bg-swamp text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#02543d] transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 pb-20">
      {/* Cover image */}
      {post.image_url && (
        <div className="w-full h-[50vh] overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-swamp font-medium text-sm mt-8 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Title & meta */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6 mb-8">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {post.author ?? "SEES Team"}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {getReadTime(post.content)} min read
          </span>
          <span>
            {new Date(post.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content ?? ""}
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/blog/${r.id}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={r.image_url ?? "/contentone.jpg"}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Clock size={11} /> {getReadTime(r.content)} min read
                  </p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-swamp transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;