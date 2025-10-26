type ContentCardProps = {
  img: string; // this will be your image URL
};

const ContentCard = (props: ContentCardProps) => {
  return (
    <div className="content-card">
      <div
        className="content-img"
        style={{ backgroundImage: `url(${props.img})` }}
      ></div>

      <div className="brief-intro">
        <div className="title-and-time">
          <div className="content-title">The Fall</div>

          <div className="time">
            <div className="time-text">3 min</div>
            <div className="timer">
              <img src="/image copy.png" alt="timer icon" />
            </div>
          </div>
        </div>

        <div className="short-text">
          It was the sign out of 2025 when Sunmisola Ganikale saw a bright...
        </div>

        <div className="read-more">
          <a href="#">Read more</a>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
