import { Route, Routes } from "react-router-dom";
import "./App.css";
import Resources from "./pages/resources";

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
