import { useRef, useEffect } from "react";
import "./App.css";
import "./styles/homepage.css"
import Vision from "./components/Vision";
import About from "./components/About";
import Resources from "./routes/Resources";
import ContentCard from "./components/ContentCard";
import Hod from "./components/Hod";
import Newsletter from "./components/Newsletter";
const App = () => {

  type Events = {
    imgSrc : string,
    mainContent : string,
    sideContent : string,
    daysLeft : number
    hoursLeft : number
    minutesLeft : number
  }

  const events: Events[] = [{
    imgSrc : "/bg-one.jpg",
    mainContent : "Student Initiative Programe",
    sideContent : "Theme: The light of the young shall prevail",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  },

  {
    imgSrc : "/bg-two.png",
    mainContent : "Student Debate Competition",
    sideContent : "Theme: The light of the young shall prevail",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  },

  {
    imgSrc : "/bg-three.png",
    mainContent : "Student Food Drive",
    sideContent : "Theme: The light of the young shall prevail",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  }
]

const mainRef = useRef<HTMLDivElement | null>(null);
const mainContentRef = useRef<HTMLDivElement | null>(null);
const sideContentRef = useRef<HTMLDivElement | null>(null);
const currentIndex = useRef(0)

useEffect(() => {
  const transition = () => {
    if(mainRef.current){
      mainRef.current.style.backgroundImage = `url(${events[currentIndex.current].imgSrc})`
    if (mainContentRef.current) {
      mainContentRef.current.innerHTML = events[currentIndex.current].mainContent;
    }

    if(sideContentRef.current){
      sideContentRef.current.innerHTML = events[currentIndex.current].sideContent
    }

       currentIndex.current = currentIndex.current === 2 ? 0 : currentIndex.current + 1
    }
  }

  transition();
  const interval = setInterval(transition, 5000)
  return () => clearInterval(interval)}, [])

  return (
    <div className="all-contents">
      <div className="main pt-[70px] md:pt-[87px]" ref={mainRef}>
        <div className="overlay"></div>

        <div className="rest">
          <div className="welcome-texts">
          <div className="main-content" ref={mainContentRef} />
          <div className="side-text" ref={sideContentRef} />

            <div className="countdown">
            <div className="time-box">
              <div className="number">24</div>
              <div className="label">Days</div>
            </div>
            <span className="colon">:</span>
            <div className="time-box">
              <div className="number">24</div>
              <div className="label">Hours</div>
            </div>
            <span className="colon">:</span>
            <div className="time-box">
              <div className="number">24</div>
              <div className="label">Mins</div>
            </div>
          </div>

          </div>
          
        </div>
      </div>

      <Vision />  
      <About />

      <div className="all">
        <div className="contentcard-container">
        <ContentCard img="/contenttwo.jpg"/>
        <ContentCard img="/contentone.jpg"/>
        <ContentCard img="/contenttwo.jpg"/>
      </div>  
      </div>

      <Resources />
      <Hod />
      <Newsletter />
    </div>
  )
}

export default App