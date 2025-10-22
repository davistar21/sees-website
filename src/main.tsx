import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Header from "./components/Header.tsx";
import Events from "./routes/Events.tsx";
import Executives from "./routes/Executives.tsx";
import Teams from "./routes/Teams.tsx";
import Resources from "./routes/Resources.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer.tsx";
const router = createBrowserRouter([
  //Add the routes here
  { path: "/", element: <App /> },
  { path: "/events", element: <Events /> },
  { path: "/executives", element: <Executives /> },
  { path: "/teams", element: <Teams /> },
  { path: "/resources", element: <Resources /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Header />

    <Footer />
  </StrictMode>
);
