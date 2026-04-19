import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

type ContentCardProps = {
  id: string;
  img: string;
  title: string;
  excerpt: string;
  readTime: number;
};

const ContentCard = ({ id, img, title, excerpt, readTime }: ContentCardProps) => {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-[#E0E0E0] overflow-hidden bg-white w-full max-w-[449px] mx-auto transition-shadow hover:shadow-md">
      {/* Image */}
      <div
        className="w-full aspect-[4/3] bg-center bg-cover bg-no-repeat flex-shrink-0"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 flex-1">
        {/* Title + read time */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-lg sm:text-xl text-[#0f0f0f] leading-snug flex-1 min-w-0">
            {title}
          </h3>
          <span className="flex items-center gap-1 text-sm text-[#787878] flex-shrink-0 pt-0.5">
            <Clock size={14} />
            {readTime} min
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-sm sm:text-base text-[#787878] leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* CTA */}
        <Link
          to={id ? `/blog/${id}` : "/blog"}
          className="mt-auto block text-center py-2.5 px-6 rounded-xl font-semibold text-white text-sm sm:text-base transition-colors hover:opacity-90"
          style={{ backgroundColor: "#013f31" }}
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default ContentCard;