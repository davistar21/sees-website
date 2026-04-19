import { Link } from "react-router-dom";

type ContentCardProps = {
  id: string;
  img: string;
  title: string;
  excerpt: string;
  readTime: number; // minutes
};

const ContentCard = ({ id, img, title, excerpt, readTime }: ContentCardProps) => {
  return (
    <div className="content-card">
      <div
        className="content-img"
        style={{ backgroundImage: `url(${img})` }}
      />

      <div className="brief-intro">
        <div className="title-and-time">
          <div className="content-title">{title}</div>
          <div className="time">
            <div className="time-text">{readTime} min</div>
            <div className="timer">
              <img src="/image copy.png" alt="timer icon" />
            </div>
          </div>
        </div>

        <div className="short-text">{excerpt}</div>

        <div className="read-more">
          <Link to={`/blog/${id}`}>Read more</Link>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;