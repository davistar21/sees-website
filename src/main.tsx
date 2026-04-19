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
import Blog from "./routes/Blog.tsx";
import BlogPost from "./routes/BlogPost.tsx";
import LevelResources from "./routes/LevelResources.tsx";
import AdminLayout from "./admin/AdminLayout.tsx";
import Login from "./admin/pages/Login.tsx";
import Dashboard from "./admin/pages/Dashboard.tsx";
import AdminEvents from "./admin/pages/AdminEvents.tsx";
import AdminExecutives from "./admin/pages/AdminExecutives.tsx";
import AdminResources from "./admin/pages/AdminResources.tsx";
import AdminHomepage from "./admin/pages/AdminHomepage.tsx";
import AdminNewsletter from "./admin/pages/AdminNewsletter.tsx";
import AdminBlog from "./admin/pages/AdminBlog.tsx";
import AdminHod from "./admin/pages/AdminHod.tsx";
import ProtectedRoute from "./admin/components/ProtectedRoute.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/events", element: <Events /> },
      { path: "/executives", element: <Executives /> },
      { path: "/teams", element: <Teams /> },
      { path: "/resources", element: <Resources /> },
      { path: "/resources/:level", element: <LevelResources /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:id", element: <BlogPost /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "login", element: <Login /> },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "events",
        element: <ProtectedRoute><AdminEvents /></ProtectedRoute>,
      },
      {
        path: "executives",
        element: <ProtectedRoute><AdminExecutives /></ProtectedRoute>,
      },
      {
        path: "resources",
        element: <ProtectedRoute><AdminResources /></ProtectedRoute>,
      },
      {
        path: "homepage",
        element: <ProtectedRoute><AdminHomepage /></ProtectedRoute>,
      },
      {
        path: "newsletter",
        element: <ProtectedRoute><AdminNewsletter /></ProtectedRoute>,
      },
      {
        path: "blog",
        element: <ProtectedRoute><AdminBlog /></ProtectedRoute>,
      },
      {
        path: "hod",
        element: <ProtectedRoute><AdminHod /></ProtectedRoute>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
