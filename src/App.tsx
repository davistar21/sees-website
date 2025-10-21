import { useEffect, useRef } from "react";
import "./App.css";
import "./styles/homepage.css"
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
    mainContent : "",
    sideContent : "",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  },

  {
    imgSrc : "/bg-two.png",
    mainContent : "",
    sideContent : "",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  },

  {
    imgSrc : "/bg-three.png",
    mainContent : "",
    sideContent : "",  
    daysLeft : 24,
    hoursLeft : 24,
    minutesLeft : 24
  }
]

const mainRef = useRef<HTMLDivElement | null>(null);
const currentIndex = useRef(0)

useEffect(() => {
  const transition = () => {
    if(mainRef.current){
      mainRef.current.style.backgroundImage = `url(${events[currentIndex.current].imgSrc})`

       currentIndex.current = currentIndex.current === 2 ? 0 : currentIndex.current + 1
    }
  }

  transition();
  const interval = setInterval(transition, 5000)
  return () => clearInterval(interval)
}, [])

  return (
    <div>
      <div className="main" ref={mainRef}>
        <div className="overlay"></div>

        <div className="rest"></div>
      </div>
    </div>
  )
}

export default App

