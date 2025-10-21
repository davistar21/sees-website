import { Route, Routes } from "react-router-dom";
import "./App.css";
import Resources from "./routes/Resources";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<div className="min-h-[60vh]"></div>} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </>
  );
}

export default App;

