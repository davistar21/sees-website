import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Header from "./components/Header.tsx";
import Events from "./routes/Events.tsx";
import Executives from "./routes/Executives.tsx";
import Teams from "./routes/Teams.tsx";
import Resources from "./routes/Resources.tsx";
import Footer from "./components/Footer.tsx";
import NotFound from "./routes/404.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/events", element: <Events /> },
  { path: "/executives", element: <Executives /> },
  { path: "/teams", element: <Teams /> },
  { path: "/resources", element: <Resources /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex flex-col gap-2">
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  </StrictMode>
);
