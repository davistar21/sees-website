import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import AdminLayout from "./admin/AdminLayout.tsx";
import ProtectedRoute from "./admin/components/ProtectedRoute.tsx";

// Public routes — code-split per page
const App           = lazy(() => import("./App.tsx"));
const Events        = lazy(() => import("./routes/Events.tsx"));
const Executives    = lazy(() => import("./routes/Executives.tsx"));
const Teams         = lazy(() => import("./routes/Teams.tsx"));
const Resources     = lazy(() => import("./routes/Resources.tsx"));
const LevelResources = lazy(() => import("./routes/LevelResources.tsx"));
const Blog          = lazy(() => import("./routes/Blog.tsx"));
const BlogPost      = lazy(() => import("./routes/BlogPost.tsx"));
const NotFound      = lazy(() => import("./routes/404.tsx"));

// Admin pages — never downloaded by regular visitors
const Login          = lazy(() => import("./admin/pages/Login.tsx"));
const Dashboard      = lazy(() => import("./admin/pages/Dashboard.tsx"));
const AdminEvents    = lazy(() => import("./admin/pages/AdminEvents.tsx"));
const AdminExecutives = lazy(() => import("./admin/pages/AdminExecutives.tsx"));
const AdminTeams     = lazy(() => import("./admin/pages/AdminTeams.tsx"));
const AdminResources = lazy(() => import("./admin/pages/AdminResources.tsx"));
const AdminHomepage  = lazy(() => import("./admin/pages/AdminHomepage.tsx"));
const AdminNewsletter = lazy(() => import("./admin/pages/AdminNewsletter.tsx"));
const AdminBlog      = lazy(() => import("./admin/pages/AdminBlog.tsx"));
const AdminHod       = lazy(() => import("./admin/pages/AdminHod.tsx"));
const AdminSpotlight = lazy(() => import("./admin/pages/AdminSpotlight.tsx"));
const Register       = lazy(() => import("./admin/pages/Register.tsx"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
  </div>
);

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

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
      { path: "/",                element: <S><App /></S> },
      { path: "/events",          element: <S><Events /></S> },
      { path: "/executives",      element: <S><Executives /></S> },
      { path: "/teams",           element: <S><Teams /></S> },
      { path: "/resources",       element: <S><Resources /></S> },
      { path: "/resources/:level", element: <S><LevelResources /></S> },
      { path: "/blog",            element: <S><Blog /></S> },
      { path: "/blog/:id",        element: <S><BlogPost /></S> },
      { path: "*",                element: <S><NotFound /></S> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "login",       element: <S><Login /></S> },
      { path: "register",    element: <S><Register /></S> },
      { path: "dashboard",   element: <ProtectedRoute><S><Dashboard /></S></ProtectedRoute> },
      { path: "events",      element: <ProtectedRoute><S><AdminEvents /></S></ProtectedRoute> },
      { path: "executives",  element: <ProtectedRoute><S><AdminExecutives /></S></ProtectedRoute> },
      { path: "teams",       element: <ProtectedRoute><S><AdminTeams /></S></ProtectedRoute> },
      { path: "resources",   element: <ProtectedRoute><S><AdminResources /></S></ProtectedRoute> },
      { path: "homepage",    element: <ProtectedRoute><S><AdminHomepage /></S></ProtectedRoute> },
      { path: "newsletter",  element: <ProtectedRoute><S><AdminNewsletter /></S></ProtectedRoute> },
      { path: "blog",        element: <ProtectedRoute><S><AdminBlog /></S></ProtectedRoute> },
      { path: "hod",         element: <ProtectedRoute><S><AdminHod /></S></ProtectedRoute> },
      { path: "spotlight",   element: <ProtectedRoute><S><AdminSpotlight /></S></ProtectedRoute> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);